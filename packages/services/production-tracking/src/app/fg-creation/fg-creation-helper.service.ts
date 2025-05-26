import { GlobalResponseObject, OslRefIdRequest, ManufacturingOrderProductName, SI_ManufacturingOrderInfoModel, SI_ManufacturingOrderInfoResponse, SI_MoNumberRequest, SI_MoProdSubLineInfoResponse, SI_MoProdSubLineModel, ProcessTypeEnum, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderInfoModel, ProcessingOrderSerialRequest, PBUN_R_ProcBundleModel, PBUN_R_ProcBundlesResponse, PBUN_R_BundleModel, PBUN_C_ProcOrderRequest, SI_MoProductSubLineIdsRequest, MO_R_OslProcTypeBundlesModel, MO_R_OslBundlesResponse, OMS_R_MoOperationsListInfoResponse, OMS_R_MoStyleProdColOperationsListModel, SI_MoLineInfoModel, PBUN_R_JobBundleModel, PBUN_R_ProcJobBundlesResponse, SPS_R_JobBundles, SPS_C_ProcJobNumberRequest, CPS_C_BundlingConfirmationIdRequest, CPS_R_CutOrderConfirmedBundlesResponse, CPS_R_CutOrderConfirmedBundlesModel, PoCutBundlingMoveToInvStatusEnum, KMS_C_KnitOrderBundlingConfirmationIdRequest, KMS_R_KnitOrderConfirmedBundlesResponse, KMS_R_KnitOrderConfirmedBundlesModel, PoKnitBundlingMoveToInvStatusEnum } from "@xpparel/shared-models";
import { FgRepository } from "../entity/repository/fg.repository";
import { FgOpDepRepository } from "../entity/repository/fg-op-dep.repository";
import { CutBundlingService, KnitOrderService, KnittingReportingService, MOConfigService, OrderCreationService, ProcessingJobsService, SewingProcessingOrderService } from "@xpparel/shared-services";
import { ErrorResponse } from "@xpparel/backend-utils";
import { Injectable } from "@nestjs/common";
import { OpSequenceRefRepository } from "../entity/repository/op-sequence-ref.repository";
import { OpSequenceOpgRepository } from "../entity/repository/op-sequence-opg.repository";
import { OpSequenceOpgEntity } from "../entity/op-sequence-opg.entity";

@Injectable()
export class FgCreationHelperService {

    constructor(
       private fgRepo: FgRepository,
       private fgOpDepRepo: FgOpDepRepository,
       private omsMoInfoService: OrderCreationService,
       private knitOrderInfoService: KnitOrderService,
       private spsOrderInfoService: SewingProcessingOrderService,
       private spsJobsInfoService: ProcessingJobsService,
       private moConfigService: MOConfigService,
       private opSeqRefRepo: OpSequenceRefRepository,
       private opSeqRepo: OpSequenceOpgRepository,
       private cutBundlingService: CutBundlingService,
       private knitBundlingService: KnittingReportingService
    ) {
        
    }

    async getOslPropsForMoNumber(moNo: string, companyCode: string, unitCode: string): Promise<SI_MoLineInfoModel[]>{
        const req = new SI_MoNumberRequest(null, companyCode, unitCode, 0, moNo, 0, false, false, true, false, true, false, false, false, false, true, true);
        const moInfoRes = await this.omsMoInfoService.getOrderInfoByManufacturingOrderNo(req);
        if(!moInfoRes.status) {
            throw new ErrorResponse(0, `Oms says : ${moInfoRes.internalMessage}`)
        }
        const lineInfo: SI_MoLineInfoModel[] = [];
        moInfoRes.data.forEach(r => {
            r.moLineModel.forEach(l => {
                lineInfo.push(l);
            })
        });
        if(lineInfo.length == 0) {
            throw new ErrorResponse(0, `No product sub lines are received from the OMS for the payload : ${JSON.stringify(req)} `);
        }
        return lineInfo;
    }

    async getBundlesForOslId(pslId: number, companyCode: string, unitCode: string): Promise<MO_R_OslProcTypeBundlesModel[]>{
        const req = new SI_MoProductSubLineIdsRequest(null, unitCode, companyCode, 0, [pslId], false, false, false, false, false, false, false);
        const pslBunRes: MO_R_OslBundlesResponse = await this.omsMoInfoService.getBundlesForPslId(req);
        if(!pslBunRes.status) {
            throw new ErrorResponse(0, `Oms says : ${pslBunRes.internalMessage}`);
        }
        const bundles = pslBunRes.data;
        return bundles;
    }

    async getProcOrderInfoForProcSerial(procSerial: number, procType: ProcessTypeEnum, companyCode: string, unitCode: string): Promise<ProcessingOrderInfoModel>{
        const req = new ProcessingOrderInfoRequest(null, unitCode, companyCode, 0, procSerial, procType, false, true, false, true, false, true, false, true, false);
        let res: ProcessingOrderInfoResponse = null;
        if(procType == ProcessTypeEnum.KNIT) {
            res = await this.knitOrderInfoService.getProcessingOrderInfo(req);
        } else {
            res = await this.spsOrderInfoService.getProcessingOrderInfo(req);
            // console.log(res);
        }
        if(!res.status) {
            throw new ErrorResponse(0, `SPS says : ${res.internalMessage}`);
        }
        const procInfo = res.data;
        return procInfo[0];
    }

    async getBundlesForProcSerialAndOslIds(procSerial: number, procType: ProcessTypeEnum, pslIds: number[], companyCode: string, unitCode: string): Promise<PBUN_R_BundleModel[]> {
        const req = new PBUN_C_ProcOrderRequest(null, unitCode, companyCode, 0, procSerial, procType, pslIds, false);
        // get the bundles from the KMS / SPS based on the processing type
        let res: PBUN_R_ProcBundlesResponse = null;
        if(procType == ProcessTypeEnum.KNIT) {
           // Not required ATM
        } else {
            res = await this.spsOrderInfoService.getProcOrderBundlesForProcSerialAndPslIds(req);
        }
        if(!res.status) {
            throw new ErrorResponse(0, `SPS says : ${res.internalMessage}`);
        }
        const bundleInfo = res.data;
        return bundleInfo[0].bundles;
    }

    async getJobsForProcSerialAndOslIds(procSerial: number, procType: ProcessTypeEnum, pslIds: number[], companyCode: string, unitCode: string): Promise<PBUN_R_JobBundleModel[]> {
        const req = new PBUN_C_ProcOrderRequest(null, unitCode, companyCode, 0, procSerial, procType, pslIds, false);
        const res: PBUN_R_ProcJobBundlesResponse = await this.spsOrderInfoService.getJobBundlesForProcSerialAndPslIds(req);
        if(!res.status) {
            throw new ErrorResponse(0, `SPS says : ${res.internalMessage}`);
        }
        const bundleInfo = res.data;
        return bundleInfo[0].bundles;
    }

    async getOpSequenceForMo(moNumber: string, companyCode: string, unitCode: string): Promise<OMS_R_MoStyleProdColOperationsListModel[]> {
        const req = new SI_MoNumberRequest(null, unitCode, companyCode, 0, moNumber, 0, false, false, false, false, false, false, false, false, false, false, false);
        const opSeqRes = await this.moConfigService.getOperationsListInfoForMo(req);
        if(!opSeqRes.status) {
            throw new ErrorResponse(0, `OMS Says : ${opSeqRes.internalMessage}`);
        }
        return opSeqRes.data;
    }

    async getOpSeqRefIdForMoProdColor(companyCode: string, unitCode: string, moNo: string, prodCode: string, fgColor: string): Promise<number> {
        const refRec = await this.opSeqRefRepo.findOne({select: ['id'], where: {companyCode, unitCode, moNo: moNo, fgColor: fgColor, prodCode: prodCode }});
        if(!refRec) {
            throw new ErrorResponse(0, `Op sequence ref record not found for mo : ${moNo} , product : ${prodCode} and color : ${fgColor}`);
        }
        return refRec.id;
    }

    async getOpgInfoForOpSeqRefId(companyCode: string, unitCode: string, opSeqRefId: number): Promise<OpSequenceOpgEntity[]> {
        const opgs = await this.opSeqRepo.find({ where: {companyCode, unitCode }});
        if(!opgs) {
            throw new ErrorResponse(0, `Op groups not found for opSeqRefId : ${opSeqRefId} `);
        }
        return opgs;
    }

    async getProcTypeOpgsInfoForOpSeqRefId(companyCode: string, unitCode: string, opSeqRefId: number): Promise<Map<ProcessTypeEnum, string[]>> {
        const opgs = await this.opSeqRepo.find({ where: {companyCode, unitCode, opSeqRefId: opSeqRefId }});
        if(!opgs) {
            throw new ErrorResponse(0, `Op groups not found for opSeqRefId : ${opSeqRefId} `);
        }
        const procTypeOpsMap = new Map<ProcessTypeEnum, string[]>();
        opgs.forEach(r => {
            if(!procTypeOpsMap.has(r.procType)) {
                procTypeOpsMap.set(r.procType, []);
            }
            procTypeOpsMap.get(r.procType).push(r.opGroup);
        });
        return procTypeOpsMap;
    }

    async getProcTypeSubProcsInfoForOpSeqRefId(companyCode: string, unitCode: string, opSeqRefId: number): Promise<Map<ProcessTypeEnum, Set<string>>> {
        const opgs = await this.opSeqRepo.find({ where: {companyCode, unitCode, opSeqRefId: opSeqRefId }});
        if(!opgs) {
            throw new ErrorResponse(0, `Op groups not found for opSeqRefId : ${opSeqRefId} `);
        }
        const procTypeOpsMap = new Map<ProcessTypeEnum, Set<string>>();
        opgs.forEach(r => {
            if(!procTypeOpsMap.has(r.procType)) {
                procTypeOpsMap.set(r.procType, new Set<string>());
            }
            procTypeOpsMap.get(r.procType).add(r.subProcName);
        });
        return procTypeOpsMap;
    }


    async getJobInfoByJobNumber(jobNumber: string, procSerial: number, companyCode: string, unitCode: string): Promise<{procType: ProcessTypeEnum, bundles: SPS_R_JobBundles[], subProc: string}> {
        const req = new SPS_C_ProcJobNumberRequest(null, unitCode, companyCode, 0, jobNumber, false, false, true, false, false, false);
        const res = await this.spsJobsInfoService.getJobInfoByJobNumber(req);
        if(!res.status) {
            throw new ErrorResponse(0, `SPS Says : ${res.internalMessage}`);
        }
        if(!res.data?.length) {
            throw new ErrorResponse(0, `No bundles found for the sewing job :${jobNumber}`);
        }
        const bundles: SPS_R_JobBundles[] = [];
        res.data.forEach(r => {
            r.bundlesInfo.forEach(b => {
                bundles.push(b);
            });
        })
        return {bundles: bundles, procType: res.data[0].procType, subProc: res.data[0].subProcessName};
    }

    async getCutConfirmedBundlesForConfirmationId(confId: number, procType: ProcessTypeEnum, companyCode: string, unitCode: string): Promise<CPS_R_CutOrderConfirmedBundlesModel> {
        const req = new CPS_C_BundlingConfirmationIdRequest(null, unitCode, companyCode, 0, confId);
        const res: CPS_R_CutOrderConfirmedBundlesResponse = await this.cutBundlingService.getConfirmedBundlesForConfirmationId(req);
        if(!res.status) {
            throw new ErrorResponse(0, `KMS Says : ${res.internalMessage}`);
        }
        return res.data[0];
    }

    async sendAckToCpsSystemForInvReceived(companyCode: string, unitCode: string, username: string, confirmationId: number, ackStatus: PoCutBundlingMoveToInvStatusEnum): Promise<boolean> {
        const req = new CPS_C_BundlingConfirmationIdRequest(username, unitCode, companyCode, 0, confirmationId, ackStatus);
        const res: GlobalResponseObject = await this.cutBundlingService.updatePtsSystemAckForBundlingConfirmation(req);
        if(!res.status) {
            throw new ErrorResponse(res.errorCode, `CPS Says : ${res.internalMessage}`);
        }
        return true;
    }

    async getKnitConfirmedBundlesForConfirmationId(confId: number, procType: ProcessTypeEnum, companyCode: string, unitCode: string): Promise<KMS_R_KnitOrderConfirmedBundlesModel> {
        const req = new KMS_C_KnitOrderBundlingConfirmationIdRequest(null, unitCode, companyCode, 0, confId, ProcessTypeEnum.KNIT);
        const res: KMS_R_KnitOrderConfirmedBundlesResponse = await this.knitBundlingService.getTheBundlesAgainstConfirmationId(req);
        if(!res.status) {
            throw new ErrorResponse(0, `KMS Says : ${res.internalMessage}`);
        }
        return res.data[0];
    }

    async sendAckToKnitSystemForInvReceived(companyCode: string, unitCode: string, username: string, confirmationId: number, ackStatus: PoKnitBundlingMoveToInvStatusEnum): Promise<boolean> {
        const req = new KMS_C_KnitOrderBundlingConfirmationIdRequest(username, unitCode, companyCode, 0, confirmationId,  ProcessTypeEnum.KNIT, ackStatus);
        const res: GlobalResponseObject = await this.knitBundlingService.updatePtsSystemAckForBundlingConfirmation(req);
        if(!res.status) {
            throw new ErrorResponse(res.errorCode, `CPS Says : ${res.internalMessage}`);
        }
        return true;
    }
}

