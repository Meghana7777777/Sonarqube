import { Injectable } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { BomItemTypeEnum, BundleGenStatusEnum, CutRmModel, CutRmSizePropsModel, GlobalResponseObject, JobsGenStatusEnum, KnitHeaderInfoResoponse, MC_ProductSubLineProcessTypeRequest, MOC_OpRoutingModel, MOC_OpRoutingResponse, MoProductFgColorReq, OperationCodeRequest, OperationModel, OpGroupModel, OpVersionModel, OpVersionRequest, PanelEmbDetailsModel, PhItemCategoryEnum, PO_PoSerialRequest, PoRmItemsModel, PoSerialRequest, ProcessingOrderCreationRequest, ProcessingOrderSerialRequest, ProcessingOrderStatusEnum, ProcessTypeEnum, RatioGenStatusEnum, RoutingGroupDetail, SI_ManufacturingOrderInfoResponse, SI_MoProdSubLineModel, SI_MoProductSubLineIdsRequest } from '@xpparel/shared-models';
import { DocketGenerationServices, MOConfigService, MoOpRoutingService, OperationService, OrderCreationService } from '@xpparel/shared-services';
import moment from 'moment';
import { DataSource, In } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { PoLineEntity } from '../common/entities/po-line-entity';
import { PoProductEntity } from '../common/entities/po-product-entity';
import { PoRoutingGroupEntity } from '../common/entities/po-routing-group-entity';
import { PoSerialsEntity } from '../common/entities/po-serials-entity';
import { PoSubLineBundleEntity } from '../common/entities/po-sub-line-bundle.entity';
import { PoSubLineEntity } from '../common/entities/po-sub-line-entity';
import { ProductSubLineFeaturesEntity } from '../common/entities/product-sub-line-features-entity';
import { PoSubLineBundleService } from './po-sub-line.bundle.service';
import { PoRoutingGroupRepository } from '../common/repository/po-routing-group-repo';
import { ProcessingOrderRepository } from '../common/repository/processing-order.repo';
import { PoLineRepository } from '../common/repository/po-line.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoSerialsRepository } from '../common/repository/po-serials.repo';
import { ProcessingOrderEntity } from '../common/entities/processing-order-entity';
import { PoHelperService } from './po-helper.service';
import { ProductSubLineFeaturesRepository } from '../common/repository/product-sub-line-features.repo';

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
        private helperService: PoHelperService,
        private operationsService: OperationService,
        private PSLFRepo: ProductSubLineFeaturesRepository,
        private docGenService: DocketGenerationServices

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
      * Creates a new Cut Processing Order.
      * TODO: so , so line need to add   --DONE
      * @param {ProcessingOrderCreationRequest} reqObj - The request object containing processing order details.
      * @returns {Promise<GlobalResponseObject>} - A response object indicating the result of the operation.
      * @throws {Error} - Throws an error if the transaction fails.
      */
    async createCutProcessingOrder(reqObj: ProcessingOrderCreationRequest): Promise<GlobalResponseObject> {
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
                        productSubLineFeaturesEntity.deliveryDate = moment(moProdSublineAttr.delDate).format("YYYY-MM-DD");
                        productSubLineFeaturesEntity.destination = moProdSublineAttr.destination;
                        productSubLineFeaturesEntity.exFactoryDate = moment(orderFeatures.exFactoryDate[0]).format("YYYY-MM-DD");
                        productSubLineFeaturesEntity.moClosedDate = moment(orderFeatures.moClosedDate[0]).format("YYYY-MM-DD");
                        productSubLineFeaturesEntity.moCreationDate = moment(orderFeatures.moCreationDate[0]).format("YYYY-MM-DD");
                        productSubLineFeaturesEntity.moId = moInfo.moPk;
                        productSubLineFeaturesEntity.moLineId = moLine.moLinePk;
                        productSubLineFeaturesEntity.moProductSubLineId = pslInfo.pk;
                        productSubLineFeaturesEntity.planCutDate = moment(orderFeatures.planCutDate[0]).format("YYYY-MM-DD");
                        productSubLineFeaturesEntity.planProdDate = moment(orderFeatures.planProductionDate[0]).format("YYYY-MM-DD");
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
            await this.poBundleService.createBundlesForPo(poSerialReq);
            this.helperService.createPslBundlesInCPS(savePoEntity.processingSerial, companyCode, unitCode, username);
            // Need to insert RM related data into PO RM Material tables
            await this.getAndSavePoMaterialInfo(poSerialReq);
            await this.getAndSavePoOperationsInfo(poSerialReq);
            return new GlobalResponseObject(true, 0, 'Processing Order Created Successfully.')
        } catch (error) {
            await transactionManager.releaseTransaction()
            throw new Error(error)
        }

    }

    /**
     * Service to get and Sve the Po material information to proceed the cut lay plan
     * Usually calls after the PO creation
     * Should be bull queue
     * @param poSerialReq 
    */
    async getAndSavePoMaterialInfo(poSerialReq: PO_PoSerialRequest): Promise<GlobalResponseObject> {
        const { processingSerial, processingType, unitCode, companyCode, userId, username } = poSerialReq;
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const processingSerialInfo = await this.poRepo.findOne({ where: { processingSerial, processType: processingType, unitCode, companyCode }, select: ['id'] });
            if (!processingSerialInfo) {
                throw new ErrorResponse(0, 'Processing Serial Information not found. Please check and try again')
            };
            const moSubLineInfo = await this.poSubLineRepo.find({ where: { processingSerial, processType: processingType, unitCode, companyCode } });
            if (!moSubLineInfo.length) {
                throw new ErrorResponse(0, 'Sub Line Details not found for the given processing serial Please check and try again')
            }
            const refProductType = moSubLineInfo[0].productType;
            const styleCode = moSubLineInfo[0].styleCode;
            const productFgSubLineMap = new Map<string, Map<string, Set<number>>>();
            const sizes = new Set<string>();
            moSubLineInfo.forEach((eachSubLine) => {
                sizes.add(eachSubLine.size);
                if (!productFgSubLineMap.has(eachSubLine.productCode)) {
                    productFgSubLineMap.set(eachSubLine.productCode, new Map<string, Set<number>>());
                }
                if (!productFgSubLineMap.get(eachSubLine.productCode).has(eachSubLine.fgColor)) {
                    productFgSubLineMap.get(eachSubLine.productCode).set(eachSubLine.fgColor, new Set<number>())
                };
                productFgSubLineMap.get(eachSubLine.productCode).get(eachSubLine.fgColor).add(eachSubLine.moProductSubLineId);
            });
            const poRmItemDetails: PoRmItemsModel[] = [];
            for (const [productCode, fgColorInfo] of productFgSubLineMap) {
                for (const [fgColor, subLines] of fgColorInfo) {
                    const routingDetails: MOC_OpRoutingModel = await this.getRoutingInfoForMOProductCodeAndFgColor(processingType, Array.from(subLines), productCode, fgColor, unitCode, companyCode);
                    const rmInfoOFProduct = this.getPoMaterialObj(routingDetails, productCode, fgColor, refProductType, styleCode, Array.from(sizes));
                    poRmItemDetails.push(rmInfoOFProduct);
                }
            }
            await manager.startTransaction();
            await this.helperService.createPoRm(processingSerial, poRmItemDetails, username, companyCode, unitCode, manager);
            await manager.completeTransaction();

            // Need to insert component serial information to CPS
            const poSerialReq = new PoSerialRequest(username, unitCode, companyCode, userId, processingSerial, null, false, false)
            await this.docGenService.createPoDocketSerialDetails(poSerialReq);
            return new GlobalResponseObject(true, 0, 'Po RM details saved successfully')
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }

    };

    /**
     * Method to get po material information 
     * TODO: Need to capture item info from the  master
     * @param routingDetails 
     * @param productCode 
     * @param fgColor 
     * @param productType 
     * @param styleCode 
     * @returns 
    */
    getPoMaterialObj(routingDetails: MOC_OpRoutingModel, productCode: string, fgColor: string, productType: string, styleCode: string, sizes: string[]): PoRmItemsModel {
        const poMaterials: PoRmItemsModel = new PoRmItemsModel(productCode, productType, fgColor, styleCode, [], []);
        for (const eachProcessType of routingDetails.processTypesList) {
            for (const subProcess of eachProcessType.subProcessList) {
                let seq = 0;
                for (const eachRm of subProcess.bomList) {
                    if (eachRm.bomItemType == BomItemTypeEnum.RM && eachRm.itemType == PhItemCategoryEnum.FABRIC) {
                        const allSizeProps: CutRmSizePropsModel[] = []
                        for (const eachSize of sizes) {
                            const sizePropsObj = new CutRmSizePropsModel(eachSize, 0, null, 0);
                            allSizeProps.push(sizePropsObj);
                        }
                        const cutRmModel = new CutRmModel(null, eachRm.bomItemCode, eachRm.bomItemName, null, null, null, null, null, ++seq, seq == 0 ? true : false, null, productCode, fgColor, 0, 0, false, 0, 0, subProcess.components.map(comp => comp.compName), null, allSizeProps);
                        poMaterials.cutRmInfo.push(cutRmModel);
                    }
                }
            }
        }
        return poMaterials;
    };

    async populateSizePropsForPoSerial(poSerial: number, unitCode: string, companyCode: string, userName: string): Promise<boolean> {
        const poSubLineInfo = await this.poSubLineRepo.find({where: {processingSerial: poSerial, unitCode, companyCode}, select: ['size']});
        const distinctSizes = new Set<string>();
        for (const eachSubLine of poSubLineInfo) {
            distinctSizes.add(eachSubLine.size);
        };
        const cutRmInfo = await this.helperService.createPoRmProps(poSerial, userName, companyCode, unitCode, Array.from(distinctSizes));
        return true;
    }


    /**
     * Service to get and Sve the Po material information to proceed the cut lay plan
     * Usually calls after the PO creation
     * Should be bull queue
     * @param poSerialReq 
    */
    async getAndSavePoOperationsInfo(poSerialReq: PO_PoSerialRequest): Promise<any> {
        const { processingSerial, processingType, unitCode, companyCode, userId, username } = poSerialReq;
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const processingSerialInfo = await this.poRepo.findOne({ where: { processingSerial, processType: processingType, unitCode, companyCode }, select: ['id'] });
            if (!processingSerialInfo) {
                throw new ErrorResponse(0, 'Processing Serial Information not found. Please check and try again')
            };
            const moSubLineInfo = await this.poSubLineRepo.find({ where: { processingSerial, processType: processingType, unitCode, companyCode } });
            if (!moSubLineInfo.length) {
                throw new ErrorResponse(0, 'Sub Line Details not found for the given processing serial Please check and try again')
            }
            const refProductType = moSubLineInfo[0].productType;
            const styleCode = moSubLineInfo[0].styleCode;
            const productFgSubLineMap = new Map<string, Map<string, Set<number>>>();
            moSubLineInfo.forEach((eachSubLine) => {
                if (!productFgSubLineMap.has(eachSubLine.productCode)) {
                    productFgSubLineMap.set(eachSubLine.productCode, new Map<string, Set<number>>());
                }
                if (!productFgSubLineMap.get(eachSubLine.productCode).has(eachSubLine.fgColor)) {
                    productFgSubLineMap.get(eachSubLine.productCode).set(eachSubLine.fgColor, new Set<number>())
                };
                productFgSubLineMap.get(eachSubLine.productCode).get(eachSubLine.fgColor).add(eachSubLine.moProductSubLineId);
            });
            const opRequests: OpVersionRequest[] = [];
            for (const [productCode, fgColorInfo] of productFgSubLineMap) {
                for (const [fgColor, subLines] of fgColorInfo) {
                    const routingDetails: MOC_OpRoutingModel = await this.getRoutingInfoForMOProductCodeAndFgColor(processingType, Array.from(subLines), productCode, fgColor, unitCode, companyCode);
                    // let count = 0;
                    // for (const processType of routingDetails.processTypesList) {
                    //     for (const eachSubProcess of processType.subProcessList) {
                    //         for (const eachComp of eachSubProcess.components) {
                    //             if (count == 0) {
                    //                 eachComp.embDetails.push(new PanelEmbDetailsModel("107"));
                    //                 eachComp.embDetails.push(new PanelEmbDetailsModel("108"));
                    //             };
                    //             ++count;

                    //         }
                    //     }
                    // }
                    const opVersionObj = await this.getOperationRoutingObj(processingSerial, routingDetails, productCode, fgColor, refProductType, styleCode, username, userId, unitCode, companyCode);
                    opRequests.push(opVersionObj);
                }
            };
            // return opRequests;
            await manager.startTransaction();
            for (const eachReq of opRequests) {
                await this.helperService.createOpVersionForProduct(eachReq, manager);
            }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Op Version details saved successfully For Given PO')
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
    };


    async getOperationRoutingObj(processingSerial: number, routingDetails: MOC_OpRoutingModel, productCode: string, fgColor: string, productType: string, styleCode: string, userName: string, userId: number, unitCode: string, companyCode: string) {
        const opVersionModel = new OpVersionModel(null, routingDetails.version, routingDetails.desc, [], [], productCode, processingSerial);
        let seq = 0;
        let groupSeq = 0;
        for (const processType of routingDetails.processTypesList) {
            for (const eachSubProcess of processType.subProcessList) {
                const depGroups = eachSubProcess.dependentSubProcesses.map(dep => dep.subProcessName);
                const componentsOfSubProcess = eachSubProcess.components.map(comp => comp.compName);
                const operationsOfSubProcess = eachSubProcess.operations.map(op => op.opCode);
                const opGroupInfo = new OpGroupModel(eachSubProcess.subProcessName, ++groupSeq, depGroups, operationsOfSubProcess, componentsOfSubProcess, processType.processType, null);
                opVersionModel.opGroups.push(opGroupInfo);
                for (const eachOp of eachSubProcess.operations) {
                    const opCodeReq = new OperationCodeRequest(userName, unitCode, companyCode, userId, eachOp.opCode)
                    const opsResp = await this.operationsService.getOperationbyOpCode(opCodeReq);
                    if (!opsResp.status) {
                        throw new ErrorResponse(opsResp.errorCode, `Ops Master Says: ${opsResp.internalMessage}`)
                    };
                    const opsInfo = opsResp.data[0];
                    const opModel = new OperationModel(eachOp.opCode, eachOp.opCode, processType.processType, opsInfo.opForm, opsInfo.opName, seq++, eachSubProcess.subProcessName, Number(eachOp.smv) ?? 0, opsInfo.machineName)
                    opVersionModel.operations.push(opModel);
                };
            };
            for (const processType of routingDetails.processTypesList) {
                for (const eachSubProcess of processType.subProcessList) {
                    // Need to insert the Enb Operations as well as a op group and operations
                    let prevEmbGroup = null;
                    for (const eachComp of eachSubProcess.components) {
                        for (const eachEmbOp of eachComp.embDetails) {
                            const embSeq = ++groupSeq;
                            const depGroup: string = !prevEmbGroup ? eachSubProcess.subProcessName : prevEmbGroup;
                            const embSubProcessName = `EMB-${embSeq}`;
                            prevEmbGroup = embSubProcessName;
                            const opCodeReq = new OperationCodeRequest(userName, unitCode, companyCode, userId, eachEmbOp.operationCode)
                            const opsResp = await this.operationsService.getOperationbyOpCode(opCodeReq);
                            if (!opsResp.status) {
                                throw new ErrorResponse(opsResp.errorCode, `Ops Master Says: ${opsResp.internalMessage}`)
                            };
                            const opsInfo = opsResp.data[0];
                            const opModel = new OperationModel(eachEmbOp.operationCode, eachEmbOp.operationCode, opsInfo.opCategory, opsInfo.opForm, opsInfo.opName, ++seq, embSubProcessName, 0, opsInfo.machineName)
                            opVersionModel.operations.push(opModel);
                            const opGroupInfo = new OpGroupModel(embSubProcessName, embSeq, [depGroup], [eachEmbOp.operationCode], [eachComp.compName], ProcessTypeEnum.EMB, null);
                            opVersionModel.opGroups.push(opGroupInfo);
                        }
                    }
                }
            }
        }
        const opVersionReq = new OpVersionRequest(userName, unitCode, companyCode, userId, productCode, fgColor, styleCode, processingSerial, opVersionModel);
        return opVersionReq;
    }

    /**
     * 
     * Getting processing job group information by calling OMS module , since the original knit group infomation will be available over there by sending PSLB ids
     * Helper function to get the knit group information 
     * @param processType 
     * @param processingSerial 
     * @param unitCode 
     * @param companyCode 
    */
    async getRoutingInfoForMOProductCodeAndFgColor(processType: ProcessTypeEnum, moProductSubLineId: number[], productCode: string, fgColor: string, unitCode: string, companyCode: string): Promise<MOC_OpRoutingModel> {
        // need to get the Operation routing information including BOM + OPERATION against o moProductSubLine Ids 
        // should return the SOC_OpRoutingModel for given product code and fg color
        const routingReq = new MC_ProductSubLineProcessTypeRequest(null, unitCode, companyCode, null, moProductSubLineId, processType);
        const opRoutingDetails: MOC_OpRoutingResponse = await this.moOpRoutingService.getRoutingGroupInfoForMOProductSubLineDetails(routingReq);
        if (!opRoutingDetails.status) {
            throw new ErrorResponse(opRoutingDetails.errorCode, opRoutingDetails.internalMessage);
        }
        const opRoutingForProductAndFgColor = opRoutingDetails.data.find(route => route.fgColor == fgColor && route.prodName == productCode);
        if (!opRoutingForProductAndFgColor) {
            throw new ErrorResponse(0, 'Routing details not found for the given mo Product sub line Ids')
        }
        return opRoutingForProductAndFgColor;
    }

    /**
     * TODO : check if we need to maintain po delete log 
     * Service to delete Processing Order
     * @param processingSerialReq 
     * @returns 
    */
    async deleteCutProcesisngOrder(processingSerialReq: ProcessingOrderSerialRequest): Promise<GlobalResponseObject> {
        const transactionManager = new GenericTransactionManager(this.dataSource);
        if(!processingSerialReq?.processingSerial?.length) {
            throw new ErrorResponse(0, `Processing serials not provided`);
        }
        const commonWhereObj = { processingSerial: In(processingSerialReq.processingSerial), processType: processingSerialReq.processType, companyCode: processingSerialReq.companyCode, unitCode: processingSerialReq.unitCode }
        // check if any jobs  are generated for the po serial
        const poStatusRes: ProcessingOrderEntity = await this.poRepo.findOne({ where: { ...commonWhereObj } })
        if (!poStatusRes) {
            throw new ErrorResponse(0, 'Processing Order not found')
        }
        if (poStatusRes.jobsGenStatus === JobsGenStatusEnum.COMPLETED) {
            throw new ErrorResponse(0, 'Jobs are already generated for the given processing order, Please delete the jobs first and then try again')
        }
        if (poStatusRes.jobsGenStatus === JobsGenStatusEnum.IN_PROGRESS) {
            throw new ErrorResponse(0, 'Jobs generation is in progress for the given processing order,Pleas e try again')
        }
        if (poStatusRes.bundleGenStatus === BundleGenStatusEnum.IN_PROGRESS) {
            throw new ErrorResponse(0, 'Bundles generation is in progress for the given processing order,Please try again after bundles are generated')
        }
        if (poStatusRes.ratioGenStatus === RatioGenStatusEnum.COMPLETED) {
            throw new ErrorResponse(0, 'Ratio generation is COMPLETED for the given processing order so can not delete ')
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
            this.helperService.deletePslBundlesInCPS(processingSerialReq.processingSerial[0], processingSerialReq.companyCode, processingSerialReq.unitCode, processingSerialReq.username)
            return new GlobalResponseObject(true, 0, 'Processing Order deleted Successfully.')
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

    async getCutHeaderInfoForProcSerial(procSerial: number, companyCode: string, unitCode: string): Promise<KnitHeaderInfoResoponse> {
        const result = await this.PSLFRepo.getHeaderInfoForProcSerial(procSerial, companyCode, unitCode);
        const procDetails = await this.poRepo.findOne({ where: { companyCode, unitCode, processingSerial: procSerial } })
        result.processingOrderDesc = procDetails.prcOrdDescription
        return new KnitHeaderInfoResoponse(true, 0, 'Data fetched successfully', result)
    }

}



