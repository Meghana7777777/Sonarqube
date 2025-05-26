import { Injectable } from '@nestjs/common';
import { GlobalResponseObject, KMS_C_KnitOrderBundlesConfirmationRequest, KMS_C_KnitOrderBundlingConfirmationIdRequest, KMS_ELGBUN_C_KnitProcSerialRequest, KMS_R_KnitOrderElgBundleModel, KMS_R_KnitOrderElgBundlesResponse, KMS_R_KnitOrderConfirmedBundleModel, KMS_R_KnitOrderConfirmedBundlesProductWise, KMS_R_KnitOrderConfirmedBundlesResponse, KMS_R_KnitOrderProductWiseElgBundlesModel, ProcessTypeEnum, KMS_R_KnitOrderConfirmedBundlesModel, InvOutRequestStatusEnum, PoKnitBundlingMoveToInvStatusEnum } from '@xpparel/shared-models';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { DataSource, In, Raw } from 'typeorm';
import { PoKnitJobPslRepository } from '../common/repository/po-knit-job-psl.repo';
import { PoKnitJobRepLogRepository } from '../common/repository/po-knit-job-rep-log.repo';
import { PoJobPslMapEntity } from '../common/entities/po-job-psl-map-entity';
import { PoSubLineBundleRepository } from '../common/repository/po-sub-line-bundle.repo';
import { KnitOrderProductBundleStateEnum, PoSubLineBundleEntity } from '../common/entities/po-sub-line-bundle.entity';
import { ErrorResponse } from '@xpparel/backend-utils';
import { PoKnitGroupRepository } from '../common/repository/po-knit-group.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { KnittingJobsReportingHelperService } from './knitting-job-rep-helper.service';
import { PoSubLineEntity } from '../common/entities/po-sub-line-entity';
import { PoKnitJobPslEntity } from '../common/entities/po-knit-job-psl-entity';
import { PoBundlingRepository } from '../common/repository/po-bundling.repo';
import { PoBundlingEntity } from '../common/entities/po-bundling.entity';

@Injectable()
export class KnittingOrderBundlingService {

    constructor(
        private dataSource: DataSource, 
        private knitJobPslRepo: PoKnitJobPslRepository,
        private knitJobRepLogRepo: PoKnitJobRepLogRepository,
        private knitOrderBundleRepo: PoSubLineBundleRepository,
        private knitGroupsRepo: PoKnitGroupRepository,
        private pslPropsRepo: PoSubLineRepository,
        private knitOrderProductRepo: PoProductRepository,
        private repHelperService: KnittingJobsReportingHelperService,
        private poBundlingRepo: PoBundlingRepository,
    ) {

    }

    // called from UI directly
    // Can be also used for knit bundle printing
    // gets the elg bundles for the given knit order
    async getEligibleBundlesForKnitOrder(req: KMS_ELGBUN_C_KnitProcSerialRequest): Promise<KMS_R_KnitOrderElgBundlesResponse> {
        const {companyCode, unitCode, username, procSerial, processingType, productCode, fgColor } = req;
        // if product code is provided, then query for the specific product code, else query for all products
        let productRefs = new Set<string>();
        const productsMap = await this.repHelperService.getProductsMapForProcSerial(companyCode, unitCode, procSerial, processingType);
        if(productCode) {
            productsMap.forEach((r, prodRef) => {
                if(r.prodCode == productCode) {
                    productRefs.add(prodRef);
                }
            });
        } else {
            productsMap.forEach((r, prodRef) => {
                productRefs.add(prodRef);
            });
        }
        // console.log(productRefs);
        if(productRefs.size == 0) {
            throw new ErrorResponse(0, `No product refs found for the given product code : ${productCode} and proc serial : ${procSerial}`);
        }
        const prodWiseElbBundlesModel: KMS_R_KnitOrderProductWiseElgBundlesModel[] = [];
        // for every product ref, construct the eligible bundles model
        for(const productRef of productRefs) {
            let oslIdsForProdRef: PoSubLineEntity[] = [];
            // first query the psl ids for the product ref and the fg colors if provided
            oslIdsForProdRef = await this.pslPropsRepo.find({select: ['moProductSubLineId'], where: {companyCode: companyCode, unitCode: unitCode, productRef: productRef, fgColor: fgColor, processingSerial: procSerial}});
            // console.log(oslIdsForProdRef);
            const requiredPslIds = oslIdsForProdRef.map(r => r.moProductSubLineId);
            // first get the pending bundles for the product formation
            const knitOrderPenBundles = await this.knitOrderBundleRepo.find({select: ['moProductSubLineId', 'bundleNumber', 'quantity'], where: { companyCode: companyCode, unitCode: unitCode, processingSerial: procSerial, procType: processingType, bundleState: KnitOrderProductBundleStateEnum.OPEN, moProductSubLineId: In(requiredPslIds) }});
            if(knitOrderPenBundles.length == 0) {
                throw new ErrorResponse(0, `No pending knit bundles found for bundling for the knit order : ${procSerial} And product code : ${productCode}`);
            }
            const prodInfo = productsMap.get(productRef);
            // first get the knit groups for the PO
            const knitGroupsInfo = await this.repHelperService.getKnitSubProcessesForProcSerial(companyCode, unitCode, procSerial, processingType, prodInfo.prodCode, requiredPslIds, fgColor);
            const knitGroups: string[] = [];
            knitGroupsInfo.subProcessList.forEach(s => knitGroups.push(s.subProcessName));
            // console.log(knitGroups);
            // console.log('A');
            let pslMinBundleQtyMap = new Map<number, number>(); // psl id => pending qty
            pslMinBundleQtyMap = await this.getPslWiseEligibleQtyForBundlingHelper(companyCode, unitCode, procSerial, processingType, requiredPslIds, knitGroups);
            // console.log(pslMinBundleQtyMap);
            // console.log('B');
            const wipPslIds: number[] = [];
            // now get all the psl ids whose min qty of all knit groups > 0
            pslMinBundleQtyMap.forEach((qty, pslId) => {
                if(qty > 0) {
                    wipPslIds.push(pslId);
                }
            });
            if(wipPslIds.length == 0) {
                throw new ErrorResponse(0, `No minimum quantity was found for bundling for the knit order : ${procSerial}`);
            }
            // console.log('C');
            const pslPropsMap = await this.repHelperService.getPslProsForPslIds(companyCode, unitCode, wipPslIds);
            const prodWiseBunModel = new KMS_R_KnitOrderProductWiseElgBundlesModel();
            prodWiseBunModel.procSerial = procSerial;
            prodWiseBunModel.processType = processingType;
            prodWiseBunModel.productCode = prodInfo.prodCode;
            prodWiseBunModel.productName = prodInfo.prodName;
            const elgBundles: KMS_R_KnitOrderElgBundleModel[] = [];
            // now iterate all the bundles and based on the psl id of the bundle check if it can be bundled
            knitOrderPenBundles.forEach(r => {
                let avlQty = pslMinBundleQtyMap.get(r.moProductSubLineId);
                if(avlQty >= r.quantity) {
                    const pslInfo = pslPropsMap.get(r.moProductSubLineId);
                    // this bundle is elg
                    const obj = new KMS_R_KnitOrderElgBundleModel();
                    obj.bundleNumber = r.bundleNumber;
                    obj.color = pslInfo.fgColor;
                    obj.pslId = r.moProductSubLineId;
                    obj.quantity = r.quantity;
                    obj.size = pslInfo.size;
                    elgBundles.push(obj);
                    // reduce the avl qty from the map
                    pslMinBundleQtyMap.set(r.moProductSubLineId, avlQty - r.quantity);
                }
            });
            prodWiseBunModel.elgBundles = elgBundles;
            prodWiseElbBundlesModel.push(prodWiseBunModel);
        }
        return new KMS_R_KnitOrderElgBundlesResponse(true, 0, 'Eligible bundles retrieved successfully', prodWiseElbBundlesModel);
    }

    // HELPER
    async getPslWiseEligibleQtyForBundlingHelper(companyCode: string, unitCode: string, procSerial: number, processingType: ProcessTypeEnum, pslIds: number[], knitGroups: string[]): Promise<Map<number, number>> {
        // if we have some bundles to be formed, then get the eligible quantity based on the WIP of the knit jobs and the psl id
        const knitJobUnBundledRepQtyRecs = await this.knitJobPslRepo.find({select: ['jobNumber', 'bundledQuantity', 'repQuantity', 'groupCode', 'moProductSubLineId'], where: { processingSerial: procSerial, processType: processingType, moProductSubLineId: In(pslIds), repQuantity: Raw(a => `bundled_quantity < rep_quantity`), unitCode: unitCode, companyCode: companyCode }});
        if(knitJobUnBundledRepQtyRecs.length == 0) {
            throw new ErrorResponse(0, `No pending reported quantity found for bundling for the knit order : ${procSerial}`);
        }
        // console.log(knitJobUnBundledRepQtyRecs);
        // now construct the group wise pending rep qtys for the bundle
        const knitGroupPenQtyMap = new Map<number, Map<string,{pendingRepQty: number}>>(); //psl id => knit group => pending rep qty
        knitJobUnBundledRepQtyRecs.forEach(r => {
            if(!knitGroupPenQtyMap.has(r.moProductSubLineId)) {
                knitGroupPenQtyMap.set(r.moProductSubLineId, new Map<string, {pendingRepQty: number}>());
            }
            if(!knitGroupPenQtyMap.get(r.moProductSubLineId).has(r.groupCode)) {
                knitGroupPenQtyMap.get(r.moProductSubLineId).set(r.groupCode, { pendingRepQty : 0});
            }
            const balQty = r.repQuantity - r.bundledQuantity;
            knitGroupPenQtyMap.get(r.moProductSubLineId).get(r.groupCode).pendingRepQty += balQty;
        });
        let pslMinBundleQtyMap = new Map<number, number>(); // psl id => pending qty
        // now iterate the group code wise pending for bundling qtys and get the min qty of all the group codes
        knitGroupPenQtyMap.forEach((r, pslId) => {
            if(!pslMinBundleQtyMap.has(pslId)) {
                pslMinBundleQtyMap.set(pslId, 999999);
            }
            // console.log(r);
            // We have to get the min qty from the WIP only if all the knit groups for that OSL id are reported
            if(r.size == knitGroups.length) {
                r.forEach(g => {
                    const preQty = pslMinBundleQtyMap.get(pslId);
                    pslMinBundleQtyMap.set(pslId, Math.min(preQty, g.pendingRepQty));
                });
            } else {
                // reset the value to 0 if the total knit groups are not available 
                pslMinBundleQtyMap.set(pslId, 0);
            }
        });
        return pslMinBundleQtyMap;
    }

    // HELPER
    async getKnitGroupOslJobWiseEligibleQtyForFillingHelper(companyCode: string, unitCode: string, procSerial: number, processingType: ProcessTypeEnum, pslIds: number[], knitGroups: string[]): Promise<Map<string, Map<number, Map<string, number>>>> {
        const knitJobUnBundledRepQtyRecs = await this.knitJobPslRepo.find({select: ['jobNumber', 'bundledQuantity', 'repQuantity', 'groupCode', 'moProductSubLineId'], where: { processingSerial: procSerial, processType: processingType, moProductSubLineId: In(pslIds), repQuantity: Raw(a => `bundled_quantity < rep_quantity`), unitCode: unitCode, companyCode: companyCode }, order: { jobNumber: 'DESC' }});
        const jobWisePenQtyMap = new Map<string, Map<number, Map<string, number>>>(); // knit group => pslid => job number => pending qty that can be bundled
        knitJobUnBundledRepQtyRecs.forEach(r => {
            if(!jobWisePenQtyMap.has(r.groupCode)) {
                jobWisePenQtyMap.set(r.groupCode, new Map<number, Map<string, number>>());
            }
            if(!jobWisePenQtyMap.get(r.groupCode).has(r.moProductSubLineId)) {
                jobWisePenQtyMap.get(r.groupCode).set(r.moProductSubLineId, new Map<string, number>());
            }
            if(!jobWisePenQtyMap.get(r.groupCode).get(r.moProductSubLineId).has(r.jobNumber)) {
                jobWisePenQtyMap.get(r.groupCode).get(r.moProductSubLineId).set(r.jobNumber, 0);
            }
            const balQty = r.repQuantity - r.bundledQuantity;
            jobWisePenQtyMap.get(r.groupCode).get(r.moProductSubLineId).set(r.jobNumber, balQty);
        });
        return jobWisePenQtyMap;
    }
    
    // called from UI directly
    // Have to apply a lock for the entire proc order
    // confirm product bundles for bundling
    async confirmProductBundlesForBundling(req: KMS_C_KnitOrderBundlesConfirmationRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username, procSerial, bundles, confirmedDate, confirmedUser, processType, productCode, fgColor } = req; 
            // read all the bundle numbers from the UI
            const bundleNumbers = bundles.map(r => {
                if(!r.bundleNo) {
                    throw new ErrorResponse(0, 'Bundle number cannot be EMPTY');
                } 
                return r.bundleNo;
            });
            if(bundleNumbers.length == 0) {
                throw new ErrorResponse(0, `Bundles are not provided in the input`);
            }
            // filter out the pending bundles for bundling
            const knitOrderPenBundles = await this.knitOrderBundleRepo.find({ select: ['moProductSubLineId', 'bundleNumber', 'quantity'], where: { companyCode: companyCode, unitCode: unitCode, processingSerial: procSerial, procType: processType, bundleState: KnitOrderProductBundleStateEnum.OPEN, bundleNumber: In(bundleNumbers) }});
            if(knitOrderPenBundles.length == 0) {
                throw new ErrorResponse(0, `The provided Bundles are already in the confirmation state`);
            }
            // console.log(knitOrderPenBundles);
            let productRefs = new Set<string>();
            const productsMap = await this.repHelperService.getProductsMapForProcSerial(companyCode, unitCode, procSerial, processType);
            productsMap.forEach((r, prodRef) => {
                if(r.prodCode == productCode) {
                    productRefs.add(prodRef);
                }
            });
            if(productRefs.size == 0) {
                throw new ErrorResponse(0, `No product refs found for the given product code : ${productCode} and proc serial : ${procSerial}`);
            }
            const productRefsArray = [...productRefs];
            // console.log(productRefs);
            const prodRef = productRefsArray[0];
            // get all the psl ids for the product ref and the processing serial
            const pslIdsForProdRefRecs = await this.pslPropsRepo.find({select: ['moProductSubLineId'], where: {companyCode: companyCode, unitCode: unitCode, productRef: prodRef, fgColor: fgColor, processingSerial: procSerial}});
            const requiredPslIds = pslIdsForProdRefRecs.map(r => r.moProductSubLineId);
            // first get the knit groups for the PO
            const prodInfo = productsMap.get(prodRef);
            // get the knit groups for the product related psl ids
            const knitGroupsInfo = await this.repHelperService.getKnitSubProcessesForProcSerial(companyCode, unitCode, procSerial, processType, prodInfo.prodCode, requiredPslIds, fgColor);
            const knitGroups: string[] = [];
            knitGroupsInfo.subProcessList.forEach(s => knitGroups.push(s.subProcessName));
            // APPLY LOCK FOR THE PROC SERIAL
            // console.log('*****************************8');
            // console.log(knitGroups);
            // get the pending wip qtys for the proc order and the prod code and fg color
            const pslMinBundleQtyMap = await this.getPslWiseEligibleQtyForBundlingHelper(companyCode, unitCode, procSerial, processType, requiredPslIds, knitGroups);
            // console.log(pslMinBundleQtyMap);
            const wipPslIds: number[] = [];
            // now get all the psl ids whose min qty of all knit groups > 0
            pslMinBundleQtyMap.forEach((qty, pslId) => {
                if(qty > 0) {
                    wipPslIds.push(pslId);
                }
            });
            if(wipPslIds.length == 0) {
                throw new ErrorResponse(0, `No minimum quantity was found for bundling for the knit order : ${procSerial}`);
            }
            const unElgBundles: string[] = [];
            const elgBundles: string[] = [];
            const incomingConsumingQtys = new Map<number, number>();
            knitOrderPenBundles.forEach(async b => {
                if(!incomingConsumingQtys.has(b.moProductSubLineId)) {
                    incomingConsumingQtys.set(b.moProductSubLineId, 0);
                }
                const bunPslId = b.moProductSubLineId;
                const remQty = pslMinBundleQtyMap.get(bunPslId);
                if(remQty >= b.quantity) {
                    elgBundles.push(b.bundleNumber);
                    pslMinBundleQtyMap.set(bunPslId, remQty - b.quantity);
                    const preQty = incomingConsumingQtys.get(bunPslId);
                    incomingConsumingQtys.set(bunPslId, b.quantity + preQty);
                } else {
                    unElgBundles.push(b.bundleNumber);
                }
            });
            if(unElgBundles.length > 0) {
                throw new ErrorResponse(0, `Some bundles are un eligible for bundling. ${unElgBundles.toString()}`);
            }
            const kgJobPslRemQtyMap = await this.getKnitGroupOslJobWiseEligibleQtyForFillingHelper(companyCode, unitCode, procSerial, processType, wipPslIds, knitGroups);
            const confirmationId = Date.now();
            console.log('---------------------------------------------');
            // console.log(kgJobPslRemQtyMap);
            // console.log(elgBundles);
            // console.log(incomingConsumingQtys);
            await transManager.startTransaction();
            // now finally update the bundles to bundled and increase the job wip qtys
            await transManager.getRepository(PoSubLineBundleEntity).update({companyCode: companyCode, unitCode: unitCode, processingSerial: procSerial, procType: processType, bundleNumber: In(elgBundles)}, { bundleState: KnitOrderProductBundleStateEnum.FORMED, confirmationId: confirmationId, finalizedQuantity: ()=>`quantity` });

            for(const [pslId, inConsumedQty] of incomingConsumingQtys) {
                for(const g of knitGroups) {
                    let currKnitGroupPslConsQty = inConsumedQty;
                    const jobsForKgAndPsl = kgJobPslRemQtyMap.get(g).get(pslId);
                    // iterate the jobs by top to bottom and update the bundled qty for the job
                    for(const [job, remQty] of jobsForKgAndPsl) {
                        let minQty = Math.min(remQty, currKnitGroupPslConsQty);
                        if(minQty > 0) {
                            await transManager.getRepository(PoKnitJobPslEntity).update({companyCode: companyCode, unitCode: unitCode, processingSerial: procSerial, processType: processType, jobNumber: job, groupCode: g, moProductSubLineId: pslId}, {bundledQuantity: ()=>`bundled_quantity + ${minQty}`});
                            // if we want to maintain the map of which bundle is formed from which job, then we have to insert the record in this place
                            currKnitGroupPslConsQty -= minQty;
                        }
                    }
                    // after iterating all the avl jobs to fulfill the incoming bundled qty, if by any chance theres a system level issue in fulfilling, then throw an error
                    if(currKnitGroupPslConsQty > 0) {
                        throw new ErrorResponse(0, `Processing error. Bundled qty is ${inConsumedQty}. But for the knit group : ${g} the quantity ${currKnitGroupPslConsQty} is not available with any job to bundle. psl id: ${pslId}`);
                    }
                }
            }
            const poBunEnt = new PoBundlingEntity();
            poBunEnt.companyCode = companyCode;
            poBunEnt.unitCode = unitCode;
            poBunEnt.createdUser = username;
            poBunEnt.confirmationId = confirmationId;
            poBunEnt.processingSerial = procSerial;
            poBunEnt.processType = processType;
            poBunEnt.confirmedBy = confirmedUser;
            poBunEnt.invStatus = PoKnitBundlingMoveToInvStatusEnum.OPEN;
            await transManager.getRepository(PoBundlingEntity).save(poBunEnt, {reload: false});
            // RELEASE THE LOCK FOR THE PROC SERIAL
            await transManager.completeTransaction();
            // handover the confirmation id to the inventory service. Call INVS Api
            await this.repHelperService.sendBundlingConfirmationToInvSystem(companyCode, unitCode, username, confirmationId);
            return new GlobalResponseObject(true, 0, `Bundles confirmed successfully`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // Called from INVS backend
    // This must happen only under a single proc serial
    async getTheBundlesAgainstConfirmationId(req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<KMS_R_KnitOrderConfirmedBundlesResponse> {
        const { companyCode, unitCode, username, confirmationId } = req;
        const confirmedBundles = await this.knitOrderBundleRepo.find({select:['bundleNumber', 'moProductSubLineId', 'fgSku', 'quantity', 'finalizedQuantity', 'processingSerial'], where: { companyCode: companyCode, unitCode: unitCode, confirmationId: confirmationId, bundleState: KnitOrderProductBundleStateEnum.FORMED}});
        if(confirmedBundles.length == 0) {
            throw new ErrorResponse(0, 'No confirmed bundles found');
        }
        const procSerial = confirmedBundles[0].processingSerial;
        const pslIds = new Set<number>();
        confirmedBundles.map(r => pslIds.add(r.moProductSubLineId));
        // now get the properties of the PSL
        const pslProps = await this.repHelperService.getPslProsForPslIds(companyCode, unitCode, [...pslIds]);
        const productWiseBundles = new Map<string, { pInfo: {pName: string, pCode: string, pType: string}, bundles: PoSubLineBundleEntity[]}>();
        // now iterate the bundles and construct the response
        confirmedBundles.forEach(b => {
            const pslInfo = pslProps.get(b.moProductSubLineId);
            const pCode = pslInfo.productCode;
            if(!productWiseBundles.has(pCode)) {
                productWiseBundles.set(pCode, { pInfo: {pName: pslInfo.productName, pCode: pslInfo.productCode, pType: pslInfo.productCode}, bundles: []});
            }
            productWiseBundles.get(pCode).bundles.push(b);
        });
        const pWiseBundles: KMS_R_KnitOrderConfirmedBundlesProductWise[] = [];
        // now iterate the prod wise bundles and construct the response
        productWiseBundles.forEach((_b_p_info, pCode) => {
            const pInfo = _b_p_info.pInfo;
            const bundlesModels: KMS_R_KnitOrderConfirmedBundleModel[] = [];
            _b_p_info.bundles.forEach(b =>{
                const pslInfo = pslProps.get(b.moProductSubLineId);
                const obj = new KMS_R_KnitOrderConfirmedBundleModel(b.fgSku, b.moProductSubLineId, b.bundleNumber, b.bundleNumber, b.quantity, b.finalizedQuantity, pslInfo.fgColor, pslInfo.size)
                bundlesModels.push(obj);
            });
            const m1 = new KMS_R_KnitOrderConfirmedBundlesProductWise(pInfo.pCode, pInfo.pName, pInfo.pType, bundlesModels);
            pWiseBundles.push(m1);
        });
        const m2 = new KMS_R_KnitOrderConfirmedBundlesModel(procSerial, ProcessTypeEnum.KNIT, pWiseBundles);
        return new KMS_R_KnitOrderConfirmedBundlesResponse(true, 0, 'Confirmed bundles retrieved', [m2]);
    }

    // Called from INVS
    async updateExtSystemAckForBundlingConfirmation(req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, confirmationId, username } = req;
        const bundlingRec = await this.poBundlingRepo.findOne({select: ['id', 'invStatus'], where: { companyCode, unitCode, confirmationId: confirmationId }});
        if(!bundlingRec) {
            throw new ErrorResponse(0, `Bundling record not found for the confirmation id : ${confirmationId}`);
        }
        if(req.ackStatus == PoKnitBundlingMoveToInvStatusEnum.MOVED_TO_INV) {
            if(bundlingRec.invStatus == PoKnitBundlingMoveToInvStatusEnum.MOVED_TO_INV) {
                throw new ErrorResponse(0, `Bundling record for confirmation id ${confirmationId} was already confirmed by the inventory`);
            }
        } else {
            if(bundlingRec.invStatus == PoKnitBundlingMoveToInvStatusEnum.OPEN) {
                throw new ErrorResponse(0, `Bundling record for confirmation id ${confirmationId} was already in open state`);
            }
        }
        await this.poBundlingRepo.update({companyCode, unitCode, confirmationId}, {invStatus: req.ackStatus});
        return new GlobalResponseObject(true, 0, `Confirmation status updated for confirmation id : ${confirmationId}`);
    }

    // Called from INVS
    async updatePtsSystemAckForBundlingConfirmation(req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, confirmationId, username } = req;
        const bundlingRec = await this.poBundlingRepo.findOne({select: ['id', 'ptsStatus'], where: { companyCode, unitCode, confirmationId: confirmationId }});
        if(!bundlingRec) {
            throw new ErrorResponse(0, `Bundling record not found for the confirmation id : ${confirmationId}`);
        }
        if(req.ackStatus == PoKnitBundlingMoveToInvStatusEnum.MOVED_TO_INV) {
            if(bundlingRec.ptsStatus == PoKnitBundlingMoveToInvStatusEnum.MOVED_TO_INV) {
                throw new ErrorResponse(0, `Bundling record for confirmation id ${confirmationId} was already confirmed by the PTS`);
            }
        } else {
            if(bundlingRec.ptsStatus == PoKnitBundlingMoveToInvStatusEnum.OPEN) {
                throw new ErrorResponse(0, `Bundling record for confirmation id ${confirmationId} was already in open state`);
            }
        }
        await this.poBundlingRepo.update({companyCode, unitCode, confirmationId}, {ptsStatus: req.ackStatus});
        return new GlobalResponseObject(true, 0, `Confirmation status updated for confirmation id : ${confirmationId}`);
    }
}

