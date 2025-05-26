import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { GlobalResponseObject, ProcessingOrderStatusEnum, PoCreationRequest, PoSerialRequest, SI_MoProductSubLineIdsRequest, ProcessingOrderCreationRequest, ProcessingOrderSerialRequest, ProcessTypeEnum, RoutingGroupDetail, JobsGenStatusEnum, PO_PoSerialRequest, KnitHeaderInfoResoponse, SI_MoProdSubLineModel, BundleGenStatusEnum, RatioGenStatusEnum } from '@xpparel/shared-models';
import { MOConfigService, OrderCreationService, OrderManagementService } from '@xpparel/shared-services';

import { ErrorResponse } from '@xpparel/backend-utils';
import { DataSource, In } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { PoLineEntity } from '../entities/po-line-entity';
import { PoProductEntity } from '../entities/po-product-entity';
import { PoRoutingGroupEntity } from '../entities/po-routing-group-entity';
import { PoSerialsEntity } from '../entities/po-serials-entity';
import { PoSubLineEntity } from '../entities/po-sub-line-entity';
import { ProcessingOrderEntity } from '../entities/processing-order-entity';
import { ProductSubLineFeaturesEntity } from '../entities/product-sub-line-features-entity';
import { PoLineRepository } from '../entities/repository/po-line.repo';
import { PoProductRepository } from '../entities/repository/po-product.repo';
import { PoRoutingGroupRepository } from '../entities/repository/po-routing-group-repo';
import { PoSerialsRepository } from '../entities/repository/po-serials.repo';
import { PoSubLineRepository } from '../entities/repository/po-sub-line.repo';
import { ProcessingOrderRepository } from '../entities/repository/processing-order.repo';
import { PoSubLineBundleService } from './po-sub-line.bundle.service';
import { ProductSubLineFeaturesRepository } from '../entities/repository/product-sub-line-features.repo';
import { PoSubLineBundleEntity } from '../entities/po-sub-line-bundle.entity';
import moment from 'moment';
import { ProcessingOrderHelperService } from './processing-order-helper.service';

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
        private PSLFRepo: ProductSubLineFeaturesRepository,
        private poBundleService: PoSubLineBundleService,
        private moConfigService : MOConfigService,
        private procOrderHelperService: ProcessingOrderHelperService


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
    async generatePoSerial(routingGroup:string, companyCode: string, unitCode: string): Promise<number> {
        await this.poSerialsRepo.increment({ companyCode, unitCode }, 'processingSerial', 1);
        const updatedRecord = await this.poSerialsRepo.findOne({ where: { companyCode, unitCode } });
        if (!updatedRecord) {
            const poSerialsEntity = new PoSerialsEntity()
            poSerialsEntity.companyCode = companyCode
            poSerialsEntity.unitCode = unitCode
            poSerialsEntity.processingSerial = 1
            poSerialsEntity.routingGroup = routingGroup
            await this.poSerialsRepo.save(poSerialsEntity)
            return 1
        }
        return updatedRecord?.processingSerial ?? 0;
    }



    /**
      * Creates a new Knitting Processing Order.
      *
      * @param {ProcessingOrderCreationRequest} reqObj - The request object containing processing order details.
      * @returns {Promise<GlobalResponseObject>} - A response object indicating the result of the operation.
      * @throws {Error} - Throws an error if the transaction fails.
      */
    async createSPSProcessingOrder(reqObj: ProcessingOrderCreationRequest): Promise<GlobalResponseObject> {
        const transactionManager = new GenericTransactionManager(this.dataSource);
        const {unitCode, companyCode, username, userId}  = reqObj;
        try {
            // Need to validate processing order quantity is more than the MO quantity or not
            const pslIds = reqObj.prcOrdSubLineInfo.map((v) => v.moProductSubLineId)
            const req = new SI_MoProductSubLineIdsRequest(reqObj.username, reqObj.unitCode, reqObj.companyCode, reqObj.userId, pslIds, true, true, true, true, true, true, true);
            const moInfoRes = await this.orderManagementService.getMoInfoByPslId(req);
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
                const alreadyCreatedSubLineQtyDetails = await this.poSubLineRepo.find({where: {moProductSubLineId: eachMoSubLine.moProductSubLineId, unitCode, companyCode}});
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
            poEntity.remarks = reqObj.prcOrdRemarks
            poEntity.status = ProcessingOrderStatusEnum.OPEN
            poEntity.styleCode = reqObj.styleCode
            poEntity.companyCode = reqObj.companyCode
            poEntity.unitCode = reqObj.unitCode
            poEntity.createdUser = reqObj.username
            poEntity.prcOrdDescription = reqObj.prcOrdDescription
            poEntity.prcOrdRemarks = reqObj.prcOrdRemarks;
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
                        productSubLineFeaturesEntity.deliveryDate =moProdSublineAttr.delDate;
                        productSubLineFeaturesEntity.destination = moProdSublineAttr.destination;
                        productSubLineFeaturesEntity.exFactoryDate =orderFeatures.exFactoryDate[0];
                        productSubLineFeaturesEntity.moClosedDate =orderFeatures.moClosedDate[0];
                        productSubLineFeaturesEntity.moCreationDate =orderFeatures.moCreationDate[0];
                        productSubLineFeaturesEntity.moId = moInfo.moPk;
                        productSubLineFeaturesEntity.moLineId = moLine.moLinePk;
                        productSubLineFeaturesEntity.moProductSubLineId = pslInfo.pk;
                        productSubLineFeaturesEntity.planCutDate =orderFeatures.planCutDate[0];
                        productSubLineFeaturesEntity.planProdDate =orderFeatures.planProductionDate[0];
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
                        productSubLineFeaturesEntity.productName = productInfo.productName;
                        productSubLineFeaturesEntity.productType = productInfo.productType;
                        productSubLineFeaturesEntity.oqType = pslInfo.oqType;
                        productSubLineFeatures.push(productSubLineFeaturesEntity)
                    }
                }
            }
            await transactionManager.getRepository(PoSubLineEntity).save(poSubLines, {reload: false});
            await transactionManager.getRepository(PoProductEntity).save(poProducts, {reload: false})
            await transactionManager.getRepository(ProductSubLineFeaturesEntity).save(productSubLineFeatures, {reload: false});
            const routingGroupDetails: RoutingGroupDetail[] = [];
            for (const eachProcessType of reqObj.processType) {
                const groupInfo = new RoutingGroupDetail(eachProcessType, reqObj.routingGroup, 0,null);
                routingGroupDetails.push(groupInfo);
            }
            await this.saveRoutingGroupsForPo(processingSerial, reqObj.unitCode, reqObj.companyCode, routingGroupDetails, reqObj.username, transactionManager);
            const poSerialReq = new PO_PoSerialRequest(username, unitCode, companyCode, userId, savePoEntity.processingSerial, reqObj.processType[0]);
            await transactionManager.completeTransaction();
            await this.poBundleService.createBundlesForPoAndBundleGroup(poSerialReq)
            return new GlobalResponseObject(true, 0, 'Processing Order Created Successfully.')
        } catch (error) {
            await transactionManager.releaseTransaction()
            throw error
        }


    }

     /**
     * TODO : check if we need to maintain po delete log 
     * Service to delete Processing Order
     * NOTE: Only 1 processing serial has to be deleted here at a time
     * @param processingSerialReq 
     * @returns 
    */
     async deleteSPSProcesisngOrder(processingSerialReq: ProcessingOrderSerialRequest): Promise<GlobalResponseObject> {
        const transactionManager = new GenericTransactionManager(this.dataSource);
        const commonWhereObj = { processingSerial: processingSerialReq.processingSerial[0], companyCode:processingSerialReq.companyCode, unitCode:processingSerialReq.unitCode }
        // check if any jobs  are generated for the po serial
        const poStatusRes:ProcessingOrderEntity = await this.poRepo.findOne({where:{...commonWhereObj}})
        // if(poStatusRes.jobsGenStatus === JobsGenStatusEnum.COMPLETED) {
        //     throw new ErrorResponse(0, 'Jobs are already generated for the given processing order, Please delete the jobs first and then try again')
        
        // }
        // if(poStatusRes.jobsGenStatus === JobsGenStatusEnum.IN_PROGRESS) {
        //     throw new ErrorResponse(0, 'Jobs generation is in progress for the given processing order,Pleas e try again')

        // }
        // if(poStatusRes.bundleGenStatus === BundleGenStatusEnum.IN_PROGRESS) {
        //     throw new ErrorResponse(0, 'Bundles generation is in progress for the given processing order,Please try again after bundles are generated')
    
        // }
        // if(poStatusRes.ratioGenStatus === RatioGenStatusEnum.COMPLETED) {
        //     throw new ErrorResponse(0, 'Ratio generation is COMPLETED for the given processing order so can not delete ')

        // }
        // if(poStatusRes.ratioGenStatus === RatioGenStatusEnum.IN_PROGRESS) {
        //     throw new ErrorResponse(0, 'Ratio generation is in progress for the given processing order, Please try again after ratio are generated')

        // }
        try{
            const { companyCode, unitCode, username,  processingSerial } = processingSerialReq;
            if(!processingSerial.length) {
                throw new ErrorResponse(0, 'Processing serial are not provided to delete');
            }
            if(processingSerial.length > 1) {
                throw new ErrorResponse(0, 'Only a single processing serial can be deleted at a time');
            }
            const routingGroupDetails = await this.poRoutingGroupRepo.find({where:{processingSerial: processingSerial[0], unitCode, companyCode}});
            if(routingGroupDetails.length == 0) {
                throw new ErrorResponse(0, `No records found for the given processing serial : ${processingSerial.toString()}`);
            }
            // Validations has to be done here

            const procTypes = routingGroupDetails.map(r => r.processType);
            await transactionManager.startTransaction();
            await transactionManager.getRepository(ProcessingOrderEntity).delete({...commonWhereObj});
            await transactionManager.getRepository(PoLineEntity).delete({...commonWhereObj});
            await transactionManager.getRepository(PoProductEntity).delete({...commonWhereObj});
            await transactionManager.getRepository(PoSubLineEntity).delete({...commonWhereObj});
            await transactionManager.getRepository(ProductSubLineFeaturesEntity).delete({...commonWhereObj});
            await transactionManager.getRepository(PoRoutingGroupEntity).delete({...commonWhereObj});
            await transactionManager.getRepository(PoSubLineBundleEntity).delete({...commonWhereObj});
            await transactionManager.completeTransaction();
            await this.moConfigService.unMapProcessingSerialsToBundles(processingSerialReq);
            for(const procType of procTypes) {
                await this.procOrderHelperService.triggerDeleteProcSerialFromPts( processingSerial[0], procType, companyCode, unitCode, username);
            }
            return new GlobalResponseObject(true, 0, 'Processing Order deleted Successfully.');
        }catch(err){
            await transactionManager.releaseTransaction();
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
            routingObj.jobsGenStatus = JobsGenStatusEnum.OPEN;
            await manager.getRepository(PoRoutingGroupEntity).save(routingObj);
        }
        return true;
    }

    async getHeaderInfoForSewSerial(poSerial: number, companyCode:string, unitCode:string) : Promise<KnitHeaderInfoResoponse>{
        const result = await this.PSLFRepo.getHeaderInfoForSewSerial(poSerial, companyCode, unitCode);
        const procDetails = await this.poRepo.findOne({where:{companyCode,unitCode,processingSerial:poSerial}})
        result.processingOrderDesc = procDetails.prcOrdDescription
        return new KnitHeaderInfoResoponse(true, 0, 'Data fetched successfully',result)
    }

}



