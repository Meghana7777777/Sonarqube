import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { BundlesBarcodeResponse, GlobalResponseObject, INV_C_InvCheckForProcTypeAndBundlesRequest, INV_C_InvOutAllocExtRefIdRequest, INV_C_InvOutAllocIdRequest, INV_C_InvOutExtRefIdToGetAllocationsRequest, INV_R_InvCheckForProcTypeBundlesResponse, INV_R_InvOutAllocationInfoAndBundlesResponse, INV_C_PslIdsRequest, SPS_C_InvOutConfirmationRequest } from '@xpparel/shared-models';
import { InvIssuanceService } from './inv-issuance.service';
import { InvOutRequestService } from './inv-out-request.service';



@ApiTags('Inventory Issuance')
@Controller('inv-issuance')
export class InvIssuanceController {
    constructor(
        private readonly invOutAllocSe: InvIssuanceService,
        private readonly invOutRequestService: InvOutRequestService
    ) {

    }

    @ApiBody({ type: SPS_C_InvOutConfirmationRequest })
    @Post('/createInvOutRequestForOutConfirmationId')
    async createInvOutRequestForOutConfirmationId(@Body() req: SPS_C_InvOutConfirmationRequest): Promise<GlobalResponseObject> {
        try {
            return await this.invOutRequestService.createInvOutRequestForOutConfirmationId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: SPS_C_InvOutConfirmationRequest })
    @Post('/deleteInvOutRequestForOutConfirmationId')
    async deleteInvOutRequestForOutConfirmationId(@Body() req: SPS_C_InvOutConfirmationRequest): Promise<GlobalResponseObject> {
        try {
            return await this.invOutRequestService.deleteInvOutRequestForOutConfirmationId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    
    @ApiBody({ type: INV_C_InvOutAllocExtRefIdRequest })
    @Post('/allocateInventoryForInvOutRequest')
    async allocateInventoryForInvOutRequest(@Body() req: INV_C_InvOutAllocExtRefIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.invOutAllocSe.allocateInventoryForInvOutRequest(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: INV_C_InvOutAllocIdRequest })
    @Post('/issueInvOutAllocation')
    async issueInvOutAllocation(@Body() req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.invOutAllocSe.issueInvOutAllocation(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: INV_C_InvCheckForProcTypeAndBundlesRequest })
    @Post('/getInventoryForGivenBundlesAndProcessTypes')
    async getInventoryForGivenBundlesAndProcessTypes(@Body() req: INV_C_InvCheckForProcTypeAndBundlesRequest): Promise<INV_R_InvCheckForProcTypeBundlesResponse> {
        try {
            return await this.invOutAllocSe.getInventoryForGivenBundlesAndProcessTypes(req);
        } catch (error) {
            console.log(error);
            return returnException(INV_R_InvCheckForProcTypeBundlesResponse, error);
        }
    }


    @ApiBody({ type: INV_C_InvOutAllocIdRequest })
    @Post('/getAllocatedInventoryForAllocationId')
    async getAllocatedInventoryForAllocationId(@Body() req: INV_C_InvOutAllocIdRequest): Promise<INV_R_InvOutAllocationInfoAndBundlesResponse> {
        try {
            return await this.invOutAllocSe.getAllocatedInventoryForAllocationId(req);
        } catch (error) {
            console.log(error);
            return returnException(INV_R_InvOutAllocationInfoAndBundlesResponse, error);
        }
    }


    @ApiBody({ type: INV_C_InvOutExtRefIdToGetAllocationsRequest })
    @Post('/getAllocationsForInvOutRequestRefId')
    async getAllocationsForInvOutRequestRefId(@Body() req: INV_C_InvOutExtRefIdToGetAllocationsRequest): Promise<INV_R_InvOutAllocationInfoAndBundlesResponse> {
        try {
            return await this.invOutAllocSe.getAllocationsForInvOutRequestRefId(req);
        } catch (error) {
            console.log(error);
            return returnException(INV_R_InvOutAllocationInfoAndBundlesResponse, error);
        }
    }


    @ApiBody({ type: INV_C_InvOutAllocIdRequest })
    @Post('/updateInvAckForAllocationIdSPS')
    async updateInvAckForAllocationIdSPS(@Body() req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.invOutAllocSe.updateInvAckForAllocationIdSPS(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: INV_C_InvOutAllocIdRequest })
    @Post('/updateInvIssAckForAllocationIdSPS')
    async updateInvIssAckForAllocationIdSPS(@Body() req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.invOutAllocSe.updateInvIssAckForAllocationIdSPS(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: INV_C_InvOutAllocIdRequest })
    @Post('/updateInvIssAckForAllocationIdPTS')
    async updateInvIssAckForAllocationIdPTS(@Body() req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.invOutAllocSe.updateInvIssAckForAllocationIdPTS(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: INV_C_PslIdsRequest })
    @Post('/getBundlesBarcodeDetails')
    async getBundlesBarcodeDetails(@Body() req: INV_C_PslIdsRequest): Promise<BundlesBarcodeResponse> {
        try {
            return await this.invOutAllocSe.getBundlesBarcodeDetails(req);
        } catch (error) {
            console.log(error);
            return returnException(BundlesBarcodeResponse, error);
        }
    }




}