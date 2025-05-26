import { Injectable } from "@nestjs/common";
import { ErrorResponse, POQtyRecommendationUtil } from "@xpparel/backend-utils";
import { BundleGenStatusEnum, GlobalResponseObject, MC_BundleCountModel, MC_MoNumberRequest, MC_MoProcessTypeModel, MC_PoPslbBundleDetailModel, MC_ProductSubLineBundleCountDetail, MOC_BundleDetail, MoProductSubLineIdAndQtyRequest, MoProductSubLineIdsRequest, PBUN_C_ProcOrderRequest, PBUN_R_BundleModel, PBUN_R_JobBundleModel, PBUN_R_ProcBundleModel, PBUN_R_ProcBundlesResponse, PBUN_R_ProcJobBundleModel, PBUN_R_ProcJobBundlesResponse, PO_PoSerialRequest, ProcessTypeEnum, ProductSubLineAndBundleDetailModel, ProductSubLineAndBundleDetailResponse } from "@xpparel/shared-models";
import { MOConfigService } from "@xpparel/shared-services";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { PoSubLineBundleEntity } from "../entities/po-sub-line-bundle.entity";
import { PoLineRepository } from "../entities/repository/po-line.repo";
import { PoRoutingGroupRepository } from "../entities/repository/po-routing-group-repo";
import { ProcessingOrderRepository } from "../entities/repository/processing-order.repo";
import { PoRoutingGroupEntity } from "../entities/po-routing-group-entity";
import { PoSubLineBundleRepository } from "../entities/repository/po-sub-line-bundle.repo";
import { SJobBundleEntity } from "../entities/s-job-bundle.entity";
import { SJobBundleRepository } from "../entities/repository/s-job-bundle.repository";
import { SJobLineRepo } from "../entities/repository/s-job-line.repository";
import { ProcessingOrderHelperService } from "./processing-order-helper.service";

@Injectable()
export class PoSubLineBundleService {
    constructor(
        private dataSource: DataSource,
        private moConfigService: MOConfigService,
        private poLineRepo: PoLineRepository,
        private poRoutingGroupRepo: PoRoutingGroupRepository,
        private poRepo: ProcessingOrderRepository,
        private poSubLineBunRepo:PoSubLineBundleRepository,
        private jobBundleRepo: SJobBundleRepository,
        private sJobLineRepo: SJobLineRepo,
        private procOrderHelperService: ProcessingOrderHelperService
    ) { }

    /**
     * TODO: need to call this function to get the eligible Product sub line ids information to crete a PO, bundle group details need to use for quantity updating against to product sub line id
     * Service to get eligible product sub lines information including bundle count combinations to recommend the bundle quantity against to this bundle to create PO product bundle
     * Usually calls from UI to get eligible Product sub line Ids and quantity recommendation based on the associate bundles user to enter for Routing Group, With in the routing group process types product sub lines eligibility won't change since processing order will be created for routing group
     * 
     * @param reqObj 
     * @returns 
    */
    async getEligibleProductSubLinesToCreatePo(reqObj: MC_MoNumberRequest, procTypes: ProcessTypeEnum[]): Promise<MC_ProductSubLineBundleCountDetail[]> {
        const { moNumber, unitCode, companyCode } = reqObj;
        const omsReq = new MC_MoProcessTypeModel(null, unitCode, companyCode, 0, moNumber, procTypes[0]);
        const eligibleProductSubLineInfo: ProductSubLineAndBundleDetailResponse = await this.moConfigService.getEligibleBundleInfoToCreatePO(omsReq);
        if (!eligibleProductSubLineInfo.status) {
            throw new ErrorResponse(eligibleProductSubLineInfo.errorCode, eligibleProductSubLineInfo.internalMessage);
        }
        const pslbBundleGroupInfo: MC_ProductSubLineBundleCountDetail[] = [];
        for (const eachPslb of eligibleProductSubLineInfo.data) {
            const bundleQtyGroup = this.getBundleQtyGroupsForGivenBundles(eachPslb.bundleDetails);
            pslbBundleGroupInfo.push(new MC_ProductSubLineBundleCountDetail(eachPslb.moProductSubLineId, bundleQtyGroup));
        }
        return pslbBundleGroupInfo;
    }

    /**
     * Supporting function to get bundle quantity group wise bundle count for given bundles
     * @param bundleDetails 
     * @returns 
    */
    getBundleQtyGroupsForGivenBundles(bundleDetails: MOC_BundleDetail[]): MC_BundleCountModel[] {
        // bundle qty group and no of bundles
        const bundleQtyGroups = new Map<number, number>();
        for (const eachBundle of bundleDetails) {
            if (!bundleQtyGroups.has(eachBundle.quantity)) {
                bundleQtyGroups.set(eachBundle.quantity, 0);
            }
            let preCount = bundleQtyGroups.get(eachBundle.quantity);
            bundleQtyGroups.set(eachBundle.quantity, ++preCount)
        };
        const bundleQtyGroupInfo = [];
        for (const [bundleQty, noOfEligibleBundles] of bundleQtyGroups) {
            bundleQtyGroupInfo.push({
                bundleQty,
                noOfEligibleBundles
            })
        }
        return bundleQtyGroupInfo;
    }

    /**
     * Supporting function to get bundle quantity group wise bundles info for given bundles
     * @param bundleDetails 
     * @returns 
    */
    getBundleQtyGroupWiseBundlesForGivenBundles(bundleDetails: MOC_BundleDetail[]): Map<number, MOC_BundleDetail[]> {
        // bundle qty group and no of bundles
        const bundleQtyGroups = new Map<number, number>();
        const bundleQtyGroupBundles = new Map<number, MOC_BundleDetail[]>();
        for (const eachBundle of bundleDetails) {
            if (!bundleQtyGroups.has(eachBundle.quantity)) {
                bundleQtyGroups.set(eachBundle.quantity, 0);
                bundleQtyGroupBundles.set(eachBundle.quantity, []);
            }
            let preCount = bundleQtyGroups.get(eachBundle.quantity);
            bundleQtyGroups.set(eachBundle.quantity, ++preCount);
            bundleQtyGroupBundles.get(eachBundle.quantity).push(eachBundle);
        };
        const bundleQtyGroupInfo: MC_BundleCountModel[] = [];
        for (const [bundleQty, noOfEligibleBundles] of bundleQtyGroups) {
            bundleQtyGroupInfo.push({
                bundleQty,
                noOfEligibleBundles
            })
        }
        return bundleQtyGroupBundles;
    }

    /**
     * TODO: Bull
     * Service to create the bundles for the PO
     * Should call after the po has been generated in the system
     * @param reqObj 
     * @returns 
    */
    async createBundlesForPoAndBundleGroup(reqObj: PO_PoSerialRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        const { processingSerial, unitCode, companyCode, username, userId } = reqObj;
        try {
            const routingGroupDetails = await this.poRoutingGroupRepo.find({where:{processingSerial, unitCode, companyCode}});
            await manager.startTransaction();   
            for (const eachRoutingGroup of routingGroupDetails) {
                const poReq = new PO_PoSerialRequest(username, unitCode, companyCode, userId, processingSerial, eachRoutingGroup.processType)
                await this.createBundlesForPo(poReq, manager);
                await manager.getRepository(PoRoutingGroupEntity).update({id: eachRoutingGroup.id},{bundleGenStatus: BundleGenStatusEnum.COMPLETED})
            }
            await manager.completeTransaction();
            // trigger the po serial info to the PTS
            for(const rec of routingGroupDetails) {
                this.procOrderHelperService.triggerCreateProcSerialToPts(processingSerial, rec.processType, companyCode, unitCode, username);
            }
            return new GlobalResponseObject(true, 0, 'Bundles Created Successfully For Given PO')
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
        
    }

    /**
     * TODO: Need to call the below API : updateProcessSerialToBundles
     * Service to Create Bundles For Given Processing Order
     * @param reqObj 
     * @returns 
    */
    async createBundlesForPo(reqObj: PO_PoSerialRequest, manager:GenericTransactionManager): Promise<GlobalResponseObject> {
        const qtyRecUtil = new POQtyRecommendationUtil()
        const { processingSerial, unitCode, companyCode, processingType, username } = reqObj;
        try {
            const poInfo = await this.poRepo.findOne({ where: { processingSerial, unitCode, companyCode } });
            if (!poInfo) {
                throw new ErrorResponse(0, 'Processing serial info not found. Please check and try again');
            }
           
            const moSubLineInfoWithMoNumber = await this.poLineRepo.getMoWiseSubLineIdsForGivenPo(processingType, processingSerial, unitCode, companyCode);
            if (!moSubLineInfoWithMoNumber.length) {
                throw new ErrorResponse(0, 'PO product sub line details not found for the given PO. Please check and try again' + processingSerial)
            }
            const moProductSerialMap = new Map<string, number[]>();
            const utilizedBundlesInfo: ProductSubLineAndBundleDetailModel[] = [];
            for (const eachSubLine of moSubLineInfoWithMoNumber) {
                if (!moProductSerialMap.has(eachSubLine.mo_number)) {
                    moProductSerialMap.set(eachSubLine.mo_number, []);
                }
                moProductSerialMap.get(eachSubLine.mo_number).push(Number(eachSubLine.mo_product_sub_line_id));
            }
            const routingGroupDetails = await this.poRoutingGroupRepo.find({ where: { processingSerial, unitCode, companyCode, processType: processingType } });
            const pslbRecBundleCount = new Map<ProcessTypeEnum, Map<number, MOC_BundleDetail[]>>();
            for (const [moNumber, pslbIds] of moProductSerialMap) {
                for (const eachProcessType of routingGroupDetails) {
                    if (!pslbRecBundleCount.has(eachProcessType.processType)) {
                        pslbRecBundleCount.set(eachProcessType.processType, new Map<number, MOC_BundleDetail[]>());
                    }
                    const moSubLineIdsReq = new MoProductSubLineIdsRequest(null, unitCode, companyCode, 0, moNumber, pslbIds, eachProcessType.processType);
                    const eligibleBundleDetails: ProductSubLineAndBundleDetailResponse = await this.moConfigService.getEligibleBundleInfoForGivenSubLineIds(moSubLineIdsReq);
                    if (!eligibleBundleDetails.status) {
                        throw new ErrorResponse(eligibleBundleDetails.errorCode, eligibleBundleDetails.internalMessage);
                    };
                    const eligibleBundleInfo: ProductSubLineAndBundleDetailModel[] = eligibleBundleDetails.data;
                    for (const eachPslbId of pslbIds) {
                        const moPslbIdQty = moSubLineInfoWithMoNumber.find(bundle => bundle.mo_product_sub_line_id == eachPslbId)?.quantity;
                        const eligibleBundleInfoForProductBundle = eligibleBundleInfo.find(productBundle => productBundle.moProductSubLineId == eachPslbId);
                        if (!eligibleBundleInfoForProductBundle) {
                            throw new ErrorResponse(0, 'Eligible bundles not found for the given product bundle id' + eachPslbId);
                        };
                        const bundleQtyGroup = this.getBundleQtyGroupsForGivenBundles(eligibleBundleInfoForProductBundle.bundleDetails);
                        const getRecommendedQty = qtyRecUtil.getPossibleQuantities(bundleQtyGroup).quantities;
                        if (!getRecommendedQty.includes(moPslbIdQty)) {
                            throw new ErrorResponse(0, 'Product sub line quantity you have entered is not matches with bundle eligible quantity, Please check and try again' + eachPslbId)
                        }
                        const recommendedBundlesCount = qtyRecUtil.getBundlesForQuantity(bundleQtyGroup, moPslbIdQty);
                        const bundleQtyGroupBundleInfo: Map<number, MOC_BundleDetail[]> = this.getBundleQtyGroupWiseBundlesForGivenBundles(eligibleBundleInfoForProductBundle.bundleDetails);
                        for (const eachBundleGroup of recommendedBundlesCount) {
                            const bundleQtyGroupBundles = bundleQtyGroupBundleInfo.get(eachBundleGroup.bundleQty);
                            const bundlesForGivenSubLineId = bundleQtyGroupBundles.slice(0, eachBundleGroup.noOfEligibleBundles);
                            if (!pslbRecBundleCount.get(eachProcessType.processType).has(eachPslbId)) {
                                pslbRecBundleCount.get(eachProcessType.processType).set(eachPslbId, [])
                            }
                            pslbRecBundleCount.get(eachProcessType.processType).get(eachPslbId).push(...bundlesForGivenSubLineId);
                        }
                    }
                }
            }
            for (const eachProcessType of routingGroupDetails) {
                for (const eachMoSubLine of moSubLineInfoWithMoNumber) {
                    const moSubLineBundles = pslbRecBundleCount.get(eachProcessType.processType).get(Number(eachMoSubLine.mo_product_sub_line_id));
                    const totalBundleQty = moSubLineBundles.reduce((prev, curr) => {
                        return prev + Number(curr.quantity);
                    }, 0);
                    if (eachMoSubLine.quantity > totalBundleQty) {
                        throw new ErrorResponse(0, 'Sub Line Mo Quantity not matches with the total recommend bundle quantity ' + `${eachProcessType.processType} - ${eachMoSubLine.mo_product_sub_line_id} - ${eachMoSubLine.quantity} - ${totalBundleQty}`);
                    }
                    for (const eachBundle of moSubLineBundles) {
                        const poBundlesObj = new PoSubLineBundleEntity();
                        poBundlesObj.bundleNumber = eachBundle.bundleNumber;
                        poBundlesObj.companyCode = companyCode;
                        poBundlesObj.createdUser = username;
                        poBundlesObj.moProductSubLineId = eachMoSubLine.mo_product_sub_line_id;
                        poBundlesObj.procType = eachProcessType.processType;
                        poBundlesObj.processingSerial = reqObj.processingSerial;
                        poBundlesObj.quantity = eachBundle.quantity;
                        poBundlesObj.unitCode = unitCode;
                        poBundlesObj.fgSku = eachBundle.itemSku;

                        await manager.getRepository(PoSubLineBundleEntity).save(poBundlesObj);
                        const moSubLineObj = utilizedBundlesInfo.find(bun => bun.moProductSubLineId == eachMoSubLine.mo_product_sub_line_id);
                        if (!moSubLineObj) {
                            const bundleObj = new ProductSubLineAndBundleDetailModel(eachMoSubLine.mo_product_sub_line_id, []);
                            utilizedBundlesInfo.push(bundleObj);
                        }
                        const moSubLineObjAct = utilizedBundlesInfo.find(bun => bun.moProductSubLineId == eachMoSubLine.mo_product_sub_line_id);
                        moSubLineObjAct.bundleDetails.push(new MOC_BundleDetail(eachBundle.bundleNumber, eachBundle.quantity, eachBundle.itemSku, eachBundle.pslId));
                    }
                }
            }
          
            const bundleUpdateReq = new MC_PoPslbBundleDetailModel(username, unitCode, companyCode, reqObj.userId, processingSerial, processingType, utilizedBundlesInfo)
            await this.moConfigService.updateProcessSerialToBundles(bundleUpdateReq);
            return new GlobalResponseObject(true, 0, 'Bundles Created Successfully for given Po Serial')
        } catch (err) {
            throw err;
        }
    }

    /**
     * TODO: Need to call this before PO creation to validate the given product bundle quantities are accurate or not with respect to MO related bundles.
     * Helper function to validate the given MO product bundles having quantities for that MO to create a PO or not
     * usually calls when we are generating PO for MO
     * @param moProductSubLineDetails 
     * @param processTypes 
    */
    async validateGivenMoProductBundlesHavingQtyToCreatePo(moProductSubLineDetails: MoProductSubLineIdAndQtyRequest[], processTypes: ProcessTypeEnum[]): Promise<boolean> {
        const qtyRecUtil = new POQtyRecommendationUtil()
        for (const moInfo of moProductSubLineDetails) {
            const pslbIds = moInfo.productSubLineInfo.map(id => id.productSubLineId);
            const moNumber = moInfo.moNumber;
            const { unitCode, companyCode } = moInfo;
            for (const eachProcessType of processTypes) {
                const moSubLineIdsReq = new MoProductSubLineIdsRequest(null, unitCode, companyCode, 0, moNumber, pslbIds, eachProcessType);
                const eligibleBundleDetails: ProductSubLineAndBundleDetailResponse = await this.moConfigService.getEligibleBundleInfoForGivenSubLineIds(moSubLineIdsReq);
                if (!eligibleBundleDetails.status) {
                    throw new ErrorResponse(eligibleBundleDetails.errorCode, eligibleBundleDetails.internalMessage);
                };
                const eligibleBundleInfo: ProductSubLineAndBundleDetailModel[] = eligibleBundleDetails.data;
                for (const eachPslbId of pslbIds) {
                    const eligibleBundleInfoForProductBundle = eligibleBundleInfo.find(productBundle => productBundle.moProductSubLineId == eachPslbId);
                    if (!eligibleBundleInfoForProductBundle) {
                        throw new ErrorResponse(0, 'Eligible bundles not found for the given product bundle id' + eachPslbId);
                    };
                    const bundleQtyGroup = this.getBundleQtyGroupsForGivenBundles(eligibleBundleInfoForProductBundle.bundleDetails);
                    const getRecommendedQty = qtyRecUtil.getPossibleQuantities(bundleQtyGroup).quantities;
                    const moPslbIdQty = moInfo.productSubLineInfo.find(subLine => subLine.productSubLineId == eachPslbId).quantity;
                    if (!getRecommendedQty.includes(moPslbIdQty)) {
                        throw new ErrorResponse(0, 'Product sub line quantity you have entered is not matches with bundle eligible quantity, Please check and try again' + eachPslbId)
                    }
                }
            }
        }
        return true;
    }

    // END POINT
    // Called from PTS
    async getProcOrderBundlesForProcSerialAndPslIds(req: PBUN_C_ProcOrderRequest): Promise<PBUN_R_ProcBundlesResponse> {
        const  { companyCode, unitCode, procSerial, procType, pslIds, iNeedBundleAttrs } = req;
        const procRec = await this.poRoutingGroupRepo.findOne({select: ['processingSerial'], where: {companyCode: companyCode, unitCode: unitCode, processingSerial: procSerial, processType: procType }});
        if(!procRec) {
            throw new ErrorResponse(0, `No processing order found for the proc serial : ${procSerial} and type : ${procType}`);
        }
        const bundles = await this.poSubLineBunRepo.find({select: ['bundleNumber', 'quantity', 'moProductSubLineId'], where: { companyCode: companyCode, unitCode: unitCode, processingSerial: procSerial, procType: procType, moProductSubLineId: In(pslIds) }});
        const bundleModels: PBUN_R_BundleModel[] = [];
        bundles.forEach(b => {
            const b1 = new PBUN_R_BundleModel(b.bundleNumber, b.bundleNumber, b.quantity, b.moProductSubLineId, null);
            bundleModels.push(b1);
        });
        const b2 = new PBUN_R_ProcBundleModel(procSerial, procType, bundleModels);
        return new PBUN_R_ProcBundlesResponse(true, 0, 'Bundles retrieved', [b2]);
    }

    // END POINT
    // Called from PTS
    async getJobBundlesForProcSerialAndPslIds(req: PBUN_C_ProcOrderRequest): Promise<PBUN_R_ProcJobBundlesResponse> {
        const  { companyCode, unitCode, procSerial, procType, pslIds, iNeedBundleAttrs } = req;
        const procRec = await this.poRoutingGroupRepo.findOne({select: ['processingSerial'], where: {companyCode: companyCode, unitCode: unitCode, processingSerial: procSerial, processType: procType }});
        if(!procRec) {
            throw new ErrorResponse(0, `No processing order found for the proc serial : ${procSerial} and type : ${procType}`);
        }

        const bundles = await this.jobBundleRepo.find({select: ['bundleNumber', 'qty', 'moProductSubLineId', 'sJobLineId'], 
            where: { companyCode: companyCode, unitCode: unitCode, processingSerial: procSerial, processType: procType, moProductSubLineId: In(pslIds) } });
        const jobIds = bundles.map(r => r.sJobLineId);
        const jobInfoMap = new Map<number, {job: string, opg: string, subProc: string}>();
        const jobRecs = await this.sJobLineRepo.find({select: ['jobNumber', 'subProcessName', 'id', 'subProcessName'], where: { id: In(jobIds), companyCode, unitCode }});
        jobRecs.forEach(r => {
            jobInfoMap.set(r.id, { opg: r.subProcessName, job: r.jobNumber, subProc: r.subProcessName });
        });
        // const bundles = await this.poSubLineBunRepo.find({select: ['bundleNumber','bundleState', 'quantity', 'moProductSubLineId', 'jobNumber'], where: { companyCode: companyCode, unitCode: unitCode, processingSerial: procSerial, procType: procType, moProductSubLineId: In(pslIds) }});
        const bundleModels: PBUN_R_JobBundleModel[] = [];
        bundles.forEach(b => {
            const jobInfo = jobInfoMap.get(b.sJobLineId);
            const b1 = new PBUN_R_JobBundleModel(b.bundleNumber, b.bundleNumber, b.qty, b.moProductSubLineId, jobInfo.job, jobInfo.opg, jobInfo.subProc, null);
            bundleModels.push(b1);
        });
        const b2 = new PBUN_R_ProcJobBundleModel(procSerial, procType, bundleModels);
        return new PBUN_R_ProcJobBundlesResponse(true, 0, 'Bundles retrieved', [b2]);
    }
}