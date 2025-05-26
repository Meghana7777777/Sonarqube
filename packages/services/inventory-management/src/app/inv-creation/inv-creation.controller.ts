import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { CPS_C_BundlingConfirmationIdRequest, GlobalResponseObject, INV_C_AvlBundlesForPslRequest, INV_R_AvlBundlesForPslResponse, JobNumberRequest, KMS_C_KnitOrderBundlingConfirmationIdRequest, OslRefIdRequest, SewSerialRequest, SewVersionRequest, SI_MoNumberRequest, SPS_C_BundleInvConfirmationIdRequest, SPS_C_InvOutConfirmationRequest } from '@xpparel/shared-models';
import { KnitInvCreationService } from './knit-inv-creation.service';
import { InvOutRequestService } from '../inv-issuance/inv-out-request.service';
import { PslCreationService } from './psl-creation.service';
import { SPSInvCreationService } from './sps-inv-creation.service';
import { CutInvCreationService } from './cut-inv-creation.service';
import { InvInfoService } from './inv-info.service';



@ApiTags('Inventory Creation')
@Controller('inv-creation')
export class InvCreationController {
    constructor(
        private readonly knitInvCreationService: KnitInvCreationService,
        private pslCreationService: PslCreationService,
        private spsInvCreationService: SPSInvCreationService,
        private cutInvCreationService: CutInvCreationService,
        private invInfoService: InvInfoService
    ) {

    }

    @ApiBody({ type: KMS_C_KnitOrderBundlingConfirmationIdRequest })
    @Post('/createKnitInvInRequestByConfirmationId')
    async createKnitInvInRequestByConfirmationId(@Body() req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.knitInvCreationService.createKnitInvInRequestByConfirmationId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: KMS_C_KnitOrderBundlingConfirmationIdRequest })
    @Post('/deleteKnitInvInRequestByConfirmationId')
    async deleteKnitInvInRequestByConfirmationId(@Body() req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.knitInvCreationService.deleteKnitInvInRequestByConfirmationId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/createPslRefIdsForMo')
    async createPslRefIdsForMo(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.pslCreationService.createPslRefIdsForMo(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/deletePslRefIdsForMo')
    async deletePslRefIdsForMo(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.pslCreationService.deletePslRefIdsForMo(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: SPS_C_BundleInvConfirmationIdRequest })
    @Post('/createSpsInvInRequestByConfirmationId')
    async createSpsInvInRequestByConfirmationId(@Body() req: SPS_C_BundleInvConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.spsInvCreationService.createSpsInvInRequestByConfirmationId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: SPS_C_BundleInvConfirmationIdRequest })
    @Post('/deleteSpsInvInRequestByConfirmationId')
    async deleteSpsInvInRequestByConfirmationId(@Body() req: SPS_C_BundleInvConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.spsInvCreationService.deleteSpsInvInRequestByConfirmationId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: CPS_C_BundlingConfirmationIdRequest })
    @Post('/createCutInvInRequestByConfirmationId')
    async createCutInvInRequestByConfirmationId(@Body() req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.cutInvCreationService.createCutInvInRequestByConfirmationId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: CPS_C_BundlingConfirmationIdRequest })
    @Post('/deleteCutInvInRequestByConfirmationId')
    async deleteCutInvInRequestByConfirmationId(@Body() req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.cutInvCreationService.deleteCutInvInRequestByConfirmationId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    // used to get inventory for a given sku and psl ids and process types
    @ApiBody({ type: INV_C_AvlBundlesForPslRequest })
    @Post('/getAvailableBundlesInvForPslIds')
    async getAvailableBundlesInvForPslIds(@Body() req: INV_C_AvlBundlesForPslRequest): Promise<INV_R_AvlBundlesForPslResponse> {
        try {
            return await this.invInfoService.getAvailableBundlesInvForPslIds(req);
        } catch (error) {
            console.log(error);
            return returnException(INV_R_AvlBundlesForPslResponse, error);
        }
    }
}
