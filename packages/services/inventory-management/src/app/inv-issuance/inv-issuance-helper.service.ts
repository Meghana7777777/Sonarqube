import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { INV_C_InvOutAllocIdRequest, ProcessTypeEnum, PTS_C_InvIssuanceRefCreateRequest, SPS_C_InvOutConfirmationRequest, SPS_C_JobTrimReqIdRequest, SPS_R_InvOutItemsForConfirmationIdModel, SPS_R_InvOutItemsForConfirmationIdResponse } from "@xpparel/shared-models";
import { InvReceivingService, ProcessingJobsService } from "@xpparel/shared-services";
import { from } from "rxjs";

@Injectable()
export class InvIssuanceHelperService {

    constructor(
        private sewJobService: ProcessingJobsService,
        private ptsInvRecService: InvReceivingService,
    ) {
        
    }

    // -----------------------------   SPS   ---------------------------------------
    async getRequestedSFGBundlesForConfirmationId(reqId: number, procType: ProcessTypeEnum, companyCode: string, unitCode: string): Promise<SPS_R_InvOutItemsForConfirmationIdModel> {
        const req = new SPS_C_InvOutConfirmationRequest(null, unitCode, companyCode, 0, reqId, procType, null, null);
        const res = await this.sewJobService.getRequestedSFGItemsForReqId(req);
        if(!res.status) {
            throw new ErrorResponse(0, `SPS Says : ${res.internalMessage}`);
        }
        return res.data;
    }

    async updateAllocationStatusToSps(refId: number, allocationId: number, companyCode: string, unitCode: string): Promise<boolean> {
        // make the API call to SPS
        return true;
    }

    async updateIssuanceStatusToSps(refId: number, allocationId: number, issuedDate: string, issuedBy: string, companyCode: string, unitCode: string, username: string): Promise<boolean> {
        // Don't remove this try catch block as this will called without await
        try {
            const m1 = new INV_C_InvOutAllocIdRequest(username, unitCode, companyCode, 0, allocationId, issuedDate, issuedBy, true);
            console.log(m1);
            const res = await this.sewJobService.issueMaterialForRequestId(m1);
            if(!res.status) {
                throw new ErrorResponse(res.errorCode, `Inventory issued Successfully. Please check with the support team, SPS Says: ${res.internalMessage}`);
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    // PTS
    async updateIssuanceStatusToPts(refId: number, allocationId: number, issuedOn: string, issuedBy: string,fromProcTypes: ProcessTypeEnum[], toProcType: ProcessTypeEnum,  companyCode: string,  unitCode: string, username: string): Promise<boolean> {
        // Don't remove this try catch block as this will called without await
        try {
            const r1 = new PTS_C_InvIssuanceRefCreateRequest(username, unitCode, companyCode, 0, allocationId, refId, issuedOn, toProcType, fromProcTypes);
            console.log(r1);
            const res = await this.ptsInvRecService.createInvIssuanceRef(r1);
            if(!res.status) {
                throw new ErrorResponse(res.errorCode, `Inventory issued Successfully. Please check with the support team, PTS Says: ${res.internalMessage}`);
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
}
