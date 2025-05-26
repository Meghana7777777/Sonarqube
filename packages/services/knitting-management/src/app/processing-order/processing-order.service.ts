import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { GlobalResponseObject, ProcessingOrderStatusEnum, PoCreationRequest, PoSerialRequest, SI_MoProductSubLineIdsRequest, ProcessingOrderCreationRequest, ProcessingOrderSerialRequest, ProcessTypeEnum, RoutingGroupDetail, MC_MoNumberRequest, MC_ProductSubLineBundleCountDetail, SI_MoProdSubLineModel, PO_PoSerialRequest, BundleGenStatusEnum, JobsGenStatusEnum, RatioGenStatusEnum, MC_StyleMoNumbersRequest, SI_ManufacturingOrderInfoResponse, MoProductFgColorReq } from '@xpparel/shared-models';
import { MOConfigService, MoOpRoutingService, OrderCreationService, OrderManagementService } from '@xpparel/shared-services';
import { TransactionalBaseService } from '../../base-services';
import { GenericTransactionManager, ITransactionManager } from '../../database/typeorm-transactions';
import { ProcessingOrderEntity } from '../common/entities/processing-order-entity';
import { PoLineEntity } from '../common/entities/po-line-entity';
import { PoProductEntity } from '../common/entities/po-product-entity';
import { PoSubLineEntity } from '../common/entities/po-sub-line-entity';
import { ProcessingOrderRepository } from '../common/repository/processing-order.repo';
import { PoLineRepository } from '../common/repository/po-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { PoSerialsRepository } from '../common/repository/po-serials.repo';
import { ProductSubLineFeaturesEntity } from '../common/entities/product-sub-line-features-entity';
import { PoRoutingGroupRepository } from '../common/repository/po-routing-group-repo';
import { PoRoutingGroupEntity } from '../common/entities/po-routing-group-entity';
import { DataSource, In } from 'typeorm';
import { PoSerialsEntity } from '../common/entities/po-serials-entity';
import { ErrorResponse } from '@xpparel/backend-utils';
import { PoSubLineBundleService } from './po-sub-line.bundle.service';
import { PoSubLineBundleEntity } from '../common/entities/po-sub-line-bundle.entity';
import moment from 'moment';
import { PoKnitJobRatioRepository } from '../common/repository/po-knit-job-ratio.repo';

@Injectable()
export class ProcessingOrderService {
    constructor(
        private dataSource: DataSource,
        private readonly orderManagementService: OrderCreationService,
        private poRoutingGroupRepo: PoRoutingGroupRepository,
        private readonly poRepo: ProcessingOrderRepository,
        private readonly poLineRepo: PoLineRepository,
        private readonly poSubLineRepo: PoSubLineRepository,
        private readonly poProductRepo: PoProductRepository,
        private readonly poSerialsRepo: PoSerialsRepository,
        private poBundleService: PoSubLineBundleService,
        private moOpRoutingService: MoOpRoutingService,
        private moConfigService: MOConfigService,
        private poKnitRatiosRepo: PoKnitJobRatioRepository

    ) {

    }


    /**
     * Incrments and returns a new PO serial number for a given combination of process type, company, and unit.
     * 
     * @param {ProcessTypeEnum} processType - The type of process for which the PO serial is generated.
     * @param {string} companyCode - The company code for which the serial is generated.
     * @param {string} unitCode - The unit code within the company for the serial.
     * @returns {Promise<number>} - The updated processing serial number.
    */
    async generatePoSerial(processType: ProcessTypeEnum, companyCode: string, unitCode: string): Promise<number> {
        await this.poSerialsRepo.increment({ companyCode, unitCode, processType }, 'processingSerial', 1);
        const updatedRecord = await this.poSerialsRepo.findOne({ where: { companyCode, unitCode, processType } });
        console.log(updatedRecord)
        if (!updatedRecord) {
            const poSerialsEntity = new PoSerialsEntity()
            poSerialsEntity.companyCode = companyCode
            poSerialsEntity.unitCode = unitCode
            poSerialsEntity.processType = processType
            poSerialsEntity.processingSerial = 1
            await this.poSerialsRepo.save(poSerialsEntity)
            return 1
        }
        return updatedRecord?.processingSerial ?? 0;
    }



    /**
     *  TODO: Bull queue for bundle generation
      * Creates a new Knitting Processing Order.
      * TODO: so , so line need to add   --DONE
      * @param {ProcessingOrderCreationRequest} reqObj - The request object containing processing order details.
      * @returns {Promise<GlobalResponseObject>} - A response object indicating the result of the operation.
      * @throws {Error} - Throws an error if the transaction fails.
      */
    async createKnitProcessingOrder(reqObj: ProcessingOrderCreationRequest): Promise<GlobalResponseObject> {
        const transactionManager = new GenericTransactionManager(this.dataSource);
        const { unitCode, companyCode, username, userId } = reqObj;
        try {
            // Need to validate processing order quantity is more than the MO quantity or not
            const pslIds = reqObj.prcOrdSubLineInfo.map((v) => v.moProductSubLineId);
            // console.log(pslIds);
            const req = new SI_MoProductSubLineIdsRequest(reqObj.username, reqObj.unitCode, reqObj.companyCode, reqObj.userId, pslIds, true, true, true, true, true, true, true);
            const moInfoRes: SI_ManufacturingOrderInfoResponse = await this.orderManagementService.getMoInfoByPslId(req);
            if (!moInfoRes.status) {
                throw new ErrorResponse(moInfoRes.errorCode, `OMS Says : ${moInfoRes.internalMessage}`);
            };
            const stylesSet = new Set<string>();
            const moNumbers: string[] = [];
            for (const eachMo of moInfoRes.data) {
                stylesSet.add(eachMo.style);
                moNumbers.push(eachMo.moNumber)
            };
            if (stylesSet.size > 1) {
                throw new ErrorResponse(0, 'You cannot create PO for two styles');
            };
            const result: MoProductFgColorReq[] = [];
            const seenKeys = new Set<string>();
            moInfoRes.data.forEach(order => {
                order.moLineModel?.forEach(line => {
                    if (line.moLineProducts) {
                        line.moLineProducts.forEach((product) => {
                            // console.log(product);
                            const key = `${order.moNumber}-${product.productCode}-${product.fgColor}`;
                            if (!seenKeys.has(key)) {
                                seenKeys.add(key);
                                result.push(
                                    new MoProductFgColorReq(
                                        username,
                                        unitCode,
                                        companyCode,
                                        userId,
                                        order.moNumber,
                                        product.productCode,
                                        product.fgColor
                                    )
                                );
                            }
                        })

                    }
                });
            });
            // console.log(result);
            if (result.length > 1) {
                const checkVersion = await this.moOpRoutingService.checkGivenMOsHavingSameOpVersions(result);
                if (!checkVersion.status) {
                    throw new ErrorResponse(checkVersion.errorCode, checkVersion.internalMessage);
                }
                if (!checkVersion.data) {
                    throw new ErrorResponse(0, 'Operation version should be common for all MOs');
                }
            }
            // const availableBundlesInfo: MC_ProductSubLineBundleCountDetail[] = [];
            const moSubLineInfo: SI_MoProdSubLineModel[] = [];
            if (!moInfoRes.status) {
                throw new ErrorResponse(moInfoRes.errorCode, moInfoRes.internalMessage)
            }
            const moNumberSet = new Set<string>();
            for (const moInfo of moInfoRes.data) {
                moNumberSet.add(moInfo.moNumber);
                for (const eachMo of moInfo.moLineModel) {
                    for (const eachMoLine of eachMo.moLineProducts) {
                        for (const eachProduct of eachMoLine.subLines) {
                            moSubLineInfo.push(eachProduct)
                        }
                    }
                }
            }
            // for (const eachMo of moNumberSet) {
            //     const moReq = new MC_MoNumberRequest(null, unitCode, companyCode, null, eachMo);
            //     const availableBundleForPo = await this.poBundleService.getEligibleProductSubLinesToCreatePo(moReq, reqObj.processType);
            //     availableBundlesInfo.push(...availableBundleForPo);
            // }
            for (const eachMoSubLine of reqObj.prcOrdSubLineInfo) {
                const productSubLineActInfo = moSubLineInfo.find(sub => sub.pk == eachMoSubLine.moProductSubLineId);
                if (!productSubLineActInfo) {
                    throw new ErrorResponse(0, 'Sub Line Id not found from OMS' + eachMoSubLine.moProductSubLineId);
                }
                const originalSubLineQty = productSubLineActInfo.qty;
                const alreadyCreatedSubLineQtyDetails = await this.poSubLineRepo.find({ where: { moProductSubLineId: eachMoSubLine.moProductSubLineId, unitCode, companyCode } });
                const alreadyCreatedSubLineQty = alreadyCreatedSubLineQtyDetails.reduce((acc, curr) => {
                    return acc + curr.quantity;
                }, 0);
                const totalPoQty = alreadyCreatedSubLineQty + eachMoSubLine.quantity;
                if (totalPoQty > originalSubLineQty) {
                    throw new ErrorResponse(0, 'You are trying to create processing order more than available quantity. Please check and try again' + `For SubLine id: ${eachMoSubLine.moProductSubLineId} Original qty: ${originalSubLineQty} Already po created qty: ${alreadyCreatedSubLineQty}`);
                }
            }
            await transactionManager.startTransaction();
            const processingSerial = await this.generatePoSerial(reqObj.processType[0], reqObj.companyCode, reqObj.unitCode)
            const poEntity = new ProcessingOrderEntity()
            poEntity.prcOrdDescription = reqObj.prcOrdDescription
            poEntity.processingSerial = processingSerial
            poEntity.processType = reqObj.processType[0]
            poEntity.remarks = reqObj.prcOrdRemarks
            poEntity.status = ProcessingOrderStatusEnum.OPEN
            poEntity.styleCode = reqObj.styleCode
            poEntity.companyCode = reqObj.companyCode
            poEntity.unitCode = reqObj.unitCode
            poEntity.createdUser = reqObj.username
            poEntity.prcOrdDescription = reqObj.prcOrdDescription
            poEntity.prcOrdRemarks = reqObj.prcOrdRemarks;
            poEntity.bundleGenStatus = BundleGenStatusEnum.IN_PROGRESS;
            const savePoEntity = await transactionManager.getRepository(ProcessingOrderEntity).save(poEntity)
            const poLines: PoLineEntity[] = []
            const poSubLines: PoSubLineEntity[] = []
            const poProducts: PoProductEntity[] = []
            const productSubLineFeatures: ProductSubLineFeaturesEntity[] = []
            const productSet = new Set<string>();
            const { data } = moInfoRes
            const moInfo = data[0]
            for (const moLine of moInfo.moLineModel) {
                const poLineEntity = new PoLineEntity()
                poLineEntity.coNumber = moInfo.moAtrs.co.join(",")
                poLineEntity.companyCode = reqObj.companyCode
                poLineEntity.createdUser = reqObj.username
                poLineEntity.customerName = "" // add in the model
                poLineEntity.poId = savePoEntity.id
                poLineEntity.processingSerial = processingSerial
                poLineEntity.processType = reqObj.processType[0]
                poLineEntity.remarks = reqObj.prcOrdRemarks
                poLineEntity.moId = moInfo.moPk
                poLineEntity.moLineId = moLine.moLinePk
                poLineEntity.moLineNumber = moLine.moLineNo
                poLineEntity.moNumber = moInfo.moNumber
                poLineEntity.unitCode = reqObj.unitCode
                poLines.push(poLineEntity)
                const poLineSaveRes = await transactionManager.getRepository(PoLineEntity).save(poLineEntity);
                for (const productInfo of moLine.moLineProducts) {
                    const key = productInfo.productName + productInfo.productCode + productInfo.productType
                    // const key = productInfo.productName
                    const productRef = `${productInfo.productName?.slice(0, 3)}${productInfo.productCode?.slice(0, 3)}${productInfo.productType?.slice(0, 3)}`;
                    // const productRef = `${productInfo.productName.slice(0, 3)}`;
                    if (!productSet.has(key)) {
                        productSet.add(key)
                        const poProductEntity = new PoProductEntity()
                        poProductEntity.companyCode = reqObj.companyCode
                        poProductEntity.createdUser = reqObj.username
                        poProductEntity.processingSerial = processingSerial
                        poProductEntity.processType = reqObj.processType[0]
                        poProductEntity.productCode = productInfo.productCode
                        poProductEntity.productName = productInfo.productName
                        poProductEntity.productType = productInfo.productCode
                        poProductEntity.productRef = productRef
                        poProductEntity.unitCode = reqObj.unitCode
                        poProducts.push(poProductEntity)
                    }
                    for (const pslInfo of productInfo.subLines) {
                        const moProdSublineAttr = pslInfo.moProdSubLineAttrs
                        const poSubLineEntity = new PoSubLineEntity()
                        poSubLineEntity.companyCode = reqObj.companyCode
                        poSubLineEntity.createdUser = reqObj.username
                        poSubLineEntity.fgColor = pslInfo.color
                        poSubLineEntity.processingSerial = processingSerial
                        poSubLineEntity.processType = reqObj.processType[0]
                        poSubLineEntity.productRef = productRef
                        poSubLineEntity.productCode = productInfo.productCode
                        poSubLineEntity.productName = productInfo.productName
                        poSubLineEntity.productType = productInfo.productType
                        poSubLineEntity.styleCode = reqObj.styleCode
                        const currPSL = reqObj.prcOrdSubLineInfo.find((v) => v.moProductSubLineId === pslInfo.pk)
                        poSubLineEntity.quantity = currPSL.quantity
                        poSubLineEntity.size = pslInfo.size
                        poSubLineEntity.moProductSubLineId = pslInfo.pk
                        poSubLineEntity.moSubLineRefNo = moProdSublineAttr.refNo
                        poSubLineEntity.unitCode = reqObj.unitCode
                        poSubLineEntity.poLineId = poLineSaveRes.id
                        poSubLines.push(poSubLineEntity)
                        const orderFeatures = pslInfo.moProdSubLineOrdFeatures
                        const productSubLineFeaturesEntity = new ProductSubLineFeaturesEntity()
                        productSubLineFeaturesEntity.companyCode = reqObj.companyCode;
                        productSubLineFeaturesEntity.businessHead = orderFeatures.businessHead[0];
                        productSubLineFeaturesEntity.customerCode = orderFeatures.customerName[0];
                        productSubLineFeaturesEntity.createdUser = reqObj.username;
                        productSubLineFeaturesEntity.deliveryDate = moProdSublineAttr.delDate;
                        productSubLineFeaturesEntity.destination = moProdSublineAttr.destination;
                        productSubLineFeaturesEntity.exFactoryDate = orderFeatures.exFactoryDate[0];
                        productSubLineFeaturesEntity.moClosedDate = orderFeatures.moClosedDate[0];
                        productSubLineFeaturesEntity.moCreationDate = orderFeatures.moCreationDate[0];
                        productSubLineFeaturesEntity.moId = moInfo.moPk;
                        productSubLineFeaturesEntity.moLineId = moLine.moLinePk;
                        productSubLineFeaturesEntity.moProductSubLineId = pslInfo.pk;
                        productSubLineFeaturesEntity.planCutDate = orderFeatures.planCutDate[0];
                        productSubLineFeaturesEntity.planProdDate = orderFeatures.planProductionDate[0];
                        productSubLineFeaturesEntity.processType = reqObj.processType[0];
                        productSubLineFeaturesEntity.processingSerial = processingSerial;
                        productSubLineFeaturesEntity.profitCenterCode = "";
                        productSubLineFeaturesEntity.profitCenterName = "";
                        productSubLineFeaturesEntity.schedule = orderFeatures.schedule[0];
                        productSubLineFeaturesEntity.styleCode = orderFeatures.styleCode[0];
                        productSubLineFeaturesEntity.styleDescription = orderFeatures.styleDescription;
                        productSubLineFeaturesEntity.styleName = orderFeatures.styleName;
                        productSubLineFeaturesEntity.unitCode = reqObj.unitCode;
                        productSubLineFeaturesEntity.zFeature = orderFeatures.zFeature[0];
                        productSubLineFeaturesEntity.moLineNumber = moLine.moLineNo;
                        productSubLineFeaturesEntity.moNumber = moInfo.moNumber;
                        productSubLineFeaturesEntity.size = pslInfo.size;
                        productSubLineFeaturesEntity.customerName = orderFeatures.customerName[0];
                        productSubLineFeaturesEntity.coNumber = orderFeatures.coNumber[0];
                        productSubLineFeaturesEntity.soLineNumber = moProdSublineAttr.soLineNumber
                        productSubLineFeaturesEntity.soNumber = moProdSublineAttr.soLineNumber
                        productSubLineFeaturesEntity.fgColor = pslInfo.color;
                        productSubLineFeaturesEntity.productCode = productInfo.productCode;
                        productSubLineFeaturesEntity.oqType = pslInfo.oqType;
                        productSubLineFeatures.push(productSubLineFeaturesEntity);
                    }
                }
            }
            await transactionManager.getRepository(PoSubLineEntity).save(poSubLines)
            await transactionManager.getRepository(PoProductEntity).save(poProducts)
            await transactionManager.getRepository(ProductSubLineFeaturesEntity).save(productSubLineFeatures);
            const routingGroupDetails: RoutingGroupDetail[] = [];
            for (const eachProcessType of reqObj.processType) {
                const groupInfo = new RoutingGroupDetail(eachProcessType, reqObj.routingGroup, 0, null);
                routingGroupDetails.push(groupInfo);
            }
            await this.saveRoutingGroupsForPo(processingSerial, reqObj.unitCode, reqObj.companyCode, routingGroupDetails, reqObj.username, transactionManager);
            await transactionManager.completeTransaction();
            const poSerialReq = new PO_PoSerialRequest(username, unitCode, companyCode, userId, savePoEntity.processingSerial, reqObj.processType[0]);
            await this.poBundleService.createBundlesForPo(poSerialReq)
            return new GlobalResponseObject(true, 0, 'Processing Order Created Successfully.')
        } catch (error) {
            await transactionManager.releaseTransaction()
            throw new Error(error)
        }


    }

    /**
     * TODO : check if we need to maintain po delete log 
     * Service to delete Processing Order
     * @param processingSerialReq 
     * @returns 
    */
    async deleteKnitProcesisngOrder(processingSerialReq: ProcessingOrderSerialRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, username, processingSerial } = processingSerialReq;
        if (!processingSerial.length) {
            throw new ErrorResponse(0, 'Processing serial are not provided to delete');
        }
        if (processingSerial.length > 1) {
            throw new ErrorResponse(0, 'Only a single processing serial can be deleted at a time');
        }
        const transactionManager = new GenericTransactionManager(this.dataSource);
        const commonWhereObj = { processingSerial: (processingSerialReq.processingSerial[0]), processType: processingSerialReq.processType, companyCode: processingSerialReq.companyCode, unitCode: processingSerialReq.unitCode }
        // check if any jobs  are generated for the po serial
        const poKnitRatiosFind = await this.poKnitRatiosRepo.findOne({ where: { ...commonWhereObj } })
        if (poKnitRatiosFind) {
            throw new ErrorResponse(0, 'Knit Ratios already generated for the given processing order, Please delete the ratio first and then try again')
        }
        const poStatusRes: ProcessingOrderEntity = await this.poRepo.findOne({ where: { ...commonWhereObj } })

        if (!poStatusRes) {
            throw new ErrorResponse(0, 'Processing Order not found')
        }
        if (poStatusRes.jobsGenStatus === JobsGenStatusEnum.COMPLETED) {
            throw new ErrorResponse(0, 'Jobs are already generated for the given processing order, Please delete the jobs first and then try again')

        }
        if (poStatusRes.jobsGenStatus === JobsGenStatusEnum.IN_PROGRESS) {
            throw new ErrorResponse(0, 'Jobs generation is in progress for the given processing order,Please try after jobs are generated')
        }
        if (poStatusRes.bundleGenStatus === BundleGenStatusEnum.IN_PROGRESS) {
            throw new ErrorResponse(0, 'Bundles generation is in progress for the given processing order,Please try again after bundles are generated')

        }
        if (poStatusRes.ratioGenStatus === RatioGenStatusEnum.COMPLETED) {
            throw new ErrorResponse(0, 'Ratio generation is already completed for the given processing order, Please delete the ratio first and then try again')

        }
        if (poStatusRes.ratioGenStatus === RatioGenStatusEnum.IN_PROGRESS) {
            throw new ErrorResponse(0, 'Ratio generation is in progress for the given processing order, Please try again after ratio are generated')
        }


        await transactionManager.startTransaction();
        try {

            await transactionManager.getRepository(ProcessingOrderEntity).delete({ ...commonWhereObj })
            await transactionManager.getRepository(PoLineEntity).delete({ ...commonWhereObj })
            await transactionManager.getRepository(PoProductEntity).delete({ ...commonWhereObj })
            await transactionManager.getRepository(PoSubLineEntity).delete({ ...commonWhereObj })
            await transactionManager.getRepository(ProductSubLineFeaturesEntity).delete({ ...commonWhereObj })
            await transactionManager.getRepository(PoRoutingGroupEntity).delete({ ...commonWhereObj })
            const { processType, ...rest } = commonWhereObj;
            await transactionManager.getRepository(PoSubLineBundleEntity).delete({ procType: processType, ...rest })
            await transactionManager.completeTransaction()
            await this.moConfigService.unMapProcessingSerialsToBundles(processingSerialReq)
            return new GlobalResponseObject(true, 1, 'Processing Order deleted Successfully.')
        } catch (err) {
            await transactionManager.releaseTransaction()
            throw err
        }

    }


    /**
     * Service to save Routing Groups for given PO
     * Should call after completion of po saving
     * @param processingSerial 
     * @param unitCode 
     * @param companyCode 
     * @param routingGroups 
     * @param userName 
     * @param manager 
     * @returns 
    */
    async saveRoutingGroupsForPo(processingSerial: number, unitCode: string, companyCode: string, routingGroups: RoutingGroupDetail[], userName: string, manager: GenericTransactionManager) {
        for (const eachProcessType of routingGroups) {
            const routingObj = new PoRoutingGroupEntity();
            routingObj.companyCode = companyCode;
            routingObj.createdUser = userName;
            routingObj.processType = eachProcessType.procType;
            routingObj.processingSerial = processingSerial;
            routingObj.routingGroup = eachProcessType.routingGroup;
            routingObj.unitCode = unitCode;
            await manager.getRepository(PoRoutingGroupEntity).save(routingObj);
        }
        return true;
    }







}



