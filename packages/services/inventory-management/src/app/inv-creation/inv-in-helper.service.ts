import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CPS_C_BundlingConfirmationIdRequest, CPS_R_CutOrderConfirmedBundlesModel, CPS_R_CutOrderConfirmedBundlesResponse, GlobalResponseObject, KMS_C_KnitOrderBundlingConfirmationIdRequest, KMS_R_KnitOrderConfirmedBundlesModel, KMS_R_KnitOrderConfirmedBundlesResponse, PoCutBundlingMoveToInvStatusEnum, PoKnitBundlingMoveToInvStatusEnum, ProcessTypeEnum, SI_MoLineInfoModel, SI_MoNumberRequest, SPS_C_BundleInvConfirmationIdRequest, SPS_R_MoveToInvConfirmationModel, SPS_R_MoveToInvConfirmationsResponse, SPS_R_SpsOrderConfirmedBundlesModel, SPS_R_SpsOrderConfirmedBundlesResponse, SpsBundleInventoryMoveToInvStatusEnum } from "@xpparel/shared-models";
import { CutBundlingService, KnittingReportingService, OrderCreationService, SpsInventoryService } from '@xpparel/shared-services';

@Injectable()
export class InvInHelperService {

    constructor(
        private knitBunService: KnittingReportingService,
        private cutBunService: CutBundlingService,
        private omsMoInfoService: OrderCreationService,
        private spsInvService: SpsInventoryService
    ) {
        
    }


    // -----------------------------   KMS   ---------------------------------------
    async getKnitConfirmedBundlesForConfirmationId(confId: number, procType: ProcessTypeEnum, companyCode: string, unitCode: string): Promise<KMS_R_KnitOrderConfirmedBundlesModel> {
        const req = new KMS_C_KnitOrderBundlingConfirmationIdRequest(null, unitCode, companyCode, 0, confId, procType);
        const res: KMS_R_KnitOrderConfirmedBundlesResponse = await this.knitBunService.getTheBundlesAgainstConfirmationId(req);
        if(!res.status) {
            throw new ErrorResponse(0, `KMS Says : ${res.internalMessage}`);
        }
        return res.data[0];
    }

    async getCutConfirmedBundlesForConfirmationId(confId: number, procType: ProcessTypeEnum, companyCode: string, unitCode: string): Promise<CPS_R_CutOrderConfirmedBundlesModel> {
        const req = new CPS_C_BundlingConfirmationIdRequest(null, unitCode, companyCode, 0, confId);
        const res: CPS_R_CutOrderConfirmedBundlesResponse = await this.cutBunService.getConfirmedBundlesForConfirmationId(req);
        if(!res.status) {
            throw new ErrorResponse(0, `CPS Says : ${res.internalMessage}`);
        }
        return res.data[0];
    }

    async getPslPropsForMoNumber(moNo: string, companyCode: string, unitCode: string): Promise<SI_MoLineInfoModel[]>{
        const req = new SI_MoNumberRequest(null, companyCode, unitCode, 0, moNo, 0, false, false, true, false, true, false, false, false, false, true, true);
        console.log(req);
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


    // --------------------------------    SPS    -----------------------------
    async getSpsConfirmedBundlesForConfirmationId(companyCode: string, unitCode: string, username: string, confirmationId: number, processType: ProcessTypeEnum): Promise<SPS_R_MoveToInvConfirmationModel> {
        const req = new SPS_C_BundleInvConfirmationIdRequest(username, unitCode, companyCode, 0, confirmationId, processType, null, true);
        const res: SPS_R_MoveToInvConfirmationsResponse = await this.spsInvService.getInventoryConfirmedBundlesForConfirmationId(req);
        if(!res.status) {
            throw new ErrorResponse(0, `KMS Says : ${res.internalMessage}`);
        }
        if(!res.data[0]?.movedBundles) {
            throw new ErrorResponse(0,`API Response received form SPS. Evaluation says.. No bundles in SPS found for the confirmation id : ${confirmationId}`);
        }
        return res.data[0];
    }

    async sendAckToKnitSystemForInvReceived(companyCode: string, unitCode: string, username: string, confirmationId: number, ackStatus: PoKnitBundlingMoveToInvStatusEnum): Promise<boolean> {
        const req = new KMS_C_KnitOrderBundlingConfirmationIdRequest(username, unitCode, companyCode, 0, confirmationId, ProcessTypeEnum.KNIT, ackStatus);
        const res: GlobalResponseObject = await this.knitBunService.updateExtSystemAckForBundlingConfirmation(req);
        if(!res.status) {
            throw new ErrorResponse(res.errorCode, `KMS Says : ${res.internalMessage}`);
        }
        return true;
    }

    async sendAckToCpsSystemForInvReceived(companyCode: string, unitCode: string, username: string, confirmationId: number, ackStatus: PoCutBundlingMoveToInvStatusEnum): Promise<boolean> {
        const req = new CPS_C_BundlingConfirmationIdRequest(username, unitCode, companyCode, 0, confirmationId, ackStatus);
        const res: GlobalResponseObject = await this.cutBunService.updateExtSystemAckForBundlingConfirmation(req);
        if(!res.status) {
            throw new ErrorResponse(res.errorCode, `CPS Says : ${res.internalMessage}`);
        }
        return true;
    }

    async sendAckToSpsSystemForInvReceived(companyCode: string, unitCode: string, username: string, confirmationId: number, processType: ProcessTypeEnum, ackStatus: SpsBundleInventoryMoveToInvStatusEnum): Promise<boolean> {
        const req = new SPS_C_BundleInvConfirmationIdRequest(username, unitCode, companyCode, 0, confirmationId, processType, ackStatus);
        const res: GlobalResponseObject = await this.spsInvService.updateExtSystemAckForInventoryConfirmation(req);
        if(!res.status) {
            throw new ErrorResponse(res.errorCode, `KMS Says : ${res.internalMessage}`);
        }
        return true;
    }
}

