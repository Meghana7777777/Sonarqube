import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { DowntimeRequest, DowntimeResponseModel, DowntimeUpdateRequest, GlobalResponseObject, SPS_C_BundleInvConfirmationIdRequest, SPS_C_ProdColorBundlesSummaryRequest, SPS_C_ProdColorEligibleBundlesForMoveToInvRequest, SPS_C_ProdColorEligibleBundlesMovingToInvRequest, SPS_C_ProdColorInvConfirmationsRetrievalRequest, SPS_R_MoveToInvAllBundlesResponse, SPS_R_MoveToInvConfirmationsResponse, SPS_R_MoveToInvProcSerialSummaryResponse, SPS_R_ProdColorEligibleBundlesForMoveToInvResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { InventoryService } from './inventory.service';
import { InventoryInfoService } from './inventory-info.service';
import { ErrorResponse } from '@xpparel/backend-utils';


@ApiTags('Sewing Inventory')
@Controller('inventory')
export class InventoryController {

    constructor(
        private invService: InventoryService,
        private invInfoService: InventoryInfoService
    ) {

    }


    @Post('getEligibleBundlesToMoveToInventoryForPoProdColorProcType')
    @ApiBody({ type: SPS_C_ProdColorEligibleBundlesForMoveToInvRequest })
    async getEligibleBundlesToMoveToInventoryForPoProdColorProcType(@Body() req: SPS_C_ProdColorEligibleBundlesForMoveToInvRequest): Promise<SPS_R_ProdColorEligibleBundlesForMoveToInvResponse> {
        try {
            return await this.invInfoService.getEligibleBundlesToMoveToInventoryForPoProdColorProcType(req);
        } catch (error) {
            console.log(error);
            return returnException(SPS_R_ProdColorEligibleBundlesForMoveToInvResponse, error);
        }
    }

    @Post('moveOutputCompletedProcTypeBundlesToInventory')
    @ApiBody({ type: SPS_C_ProdColorEligibleBundlesMovingToInvRequest })
    async moveOutputCompletedProcTypeBundlesToInventory(@Body() req: SPS_C_ProdColorEligibleBundlesMovingToInvRequest): Promise<GlobalResponseObject> {
        try {
            return await this.invService.moveOutputCompletedProcTypeBundlesToInventory(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('deleteBundleInventoryMovedConfirmation')
    @ApiBody({ type: SPS_C_BundleInvConfirmationIdRequest })
    async deleteBundleInventoryMovedConfirmation(@Body() req: SPS_C_BundleInvConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.invService.deleteBundleInventoryMovedConfirmation(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('getInventoryConfirmationsForPoProdColorProcType')
    @ApiBody({ type: SPS_C_ProdColorInvConfirmationsRetrievalRequest })
    async getInventoryConfirmationsForPoProdColorProcType(@Body() req: SPS_C_ProdColorInvConfirmationsRetrievalRequest): Promise<SPS_R_MoveToInvConfirmationsResponse> {
        try {
            return await this.invInfoService.getInventoryConfirmationsForPoProdColorProcType(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('getInventoryConfirmedBundlesForConfirmationId')
    @ApiBody({ type: SPS_C_BundleInvConfirmationIdRequest })
    async getInventoryConfirmedBundlesForConfirmationId(@Body() req: SPS_C_BundleInvConfirmationIdRequest): Promise<SPS_R_MoveToInvConfirmationsResponse> {
        try {
            return await this.invInfoService.getInventoryConfirmedBundlesForConfirmationId(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('updateExtSystemAckForInventoryConfirmation')
    @ApiBody({ type: SPS_C_BundleInvConfirmationIdRequest })
    async updateExtSystemAckForInventoryConfirmation(@Body() req: SPS_C_BundleInvConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.invService.updateExtSystemAckForInventoryConfirmation(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('getAllBundlesForPoProdColorProcType')
    @ApiBody({ type: SPS_C_ProdColorBundlesSummaryRequest })
    async getAllBundlesForPoProdColorProcType(@Body() req: SPS_C_ProdColorBundlesSummaryRequest): Promise<SPS_R_MoveToInvAllBundlesResponse> {
        try {
            return await this.invInfoService.getAllBundlesForPoProdColorProcType(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }


    @Post('getInventoryMovementSummaryForPoProdColorProcType')
    @ApiBody({ type: SPS_C_ProdColorBundlesSummaryRequest })
    async getInventoryMovementSummaryForPoProdColorProcType(@Body() req: SPS_C_ProdColorBundlesSummaryRequest): Promise<SPS_R_MoveToInvProcSerialSummaryResponse> {
        try {
            return await this.invInfoService.getInventoryMovementSummaryForPoProdColorProcType(req);
        } catch (error) {
            return returnException(SPS_R_MoveToInvProcSerialSummaryResponse, error)
        }
    }

}
