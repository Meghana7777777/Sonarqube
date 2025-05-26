import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GlobalResponseObject, ItemCodeInfoResponse, MOC_OpRoutingResponse, MOC_OpRoutingRetrievalRequest, MOC_MoBOMCreationRequest, MOC_MoBomModelResponse, MOC_MoOrderRevisionRequest, MOC_MoOrderRevisionResponse, MOC_MoProdCodeRequest, MOC_MoProductFabConsResponse, MOC_MoProductFabConsumptionRequest, MOCProductFgColorVersionRequest, SupplierCodeReq, MC_MoNumberRequest, MC_MoProcessTypeModel, ProductSubLineAndBundleDetailResponse, MC_PoPslbBundleDetailModel, RoutingGroupDetailsResponse, MC_StyleMoNumbersRequest, MC_ProductSubLineProcessTypeRequest, OpVersionAbstractResponse, SI_MoNumberRequest, MoProductSubLineIdsRequest, OMS_R_MoOperationsListInfoResponse, OpVersionCheckResponse, MoProductFgColorReq, ProcessingOrderSerialRequest, PlannedBundleResponseModel } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { OrderConfigService } from './order-config.service';
import { MoOpRoutingService } from './mo-op-routing.service';
import { MoPoBundleService } from './mo-po-bundle.service';
import { MoProductFgColorService } from './mo-product-fg-colo.service';

@ApiTags('Order Config Module')
@Controller('order-config')
export class OrderConfigController {
    constructor(
        private service: OrderConfigService,
        private moOpRoutingService: MoOpRoutingService,
        private moPoBundleService: MoPoBundleService,
        private moProductFgColorService: MoProductFgColorService
    ) {

    }

    @ApiBody({ type: MOCProductFgColorVersionRequest })
    @Post('/saveOpVersionForMoProductFgColor')
    async saveOpVersionForMoProductFgColor(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.moOpRoutingService.saveOpVersionForMoProductFgColor(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }
    @ApiBody({ type: MOCProductFgColorVersionRequest })
    @Post('/deleteOperationVersionForMo')
    async deleteOperationVersionForMo(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.moOpRoutingService.deleteOperationVersionForMo(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: MOC_OpRoutingRetrievalRequest })
    @Post('/getOpVersionForMoProductFgColor')
    async getOpVersionForMoProductFgColor(@Body() reqObj: any): Promise<MOC_OpRoutingResponse> {
        try {
            return await this.moOpRoutingService.getOpVersionForMoProductFgColor(reqObj);
        } catch (error) {
            return returnException(MOC_OpRoutingResponse, error)
        }
    }


    @ApiBody({ type: MOC_MoBOMCreationRequest })
    @Post('/updateBomForOpVersionMoProductFgColor')
    async updateBomForOpVersionMoProductFgColor(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.updateBomForOpVersionMoProductFgColor(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: MOCProductFgColorVersionRequest })
    @Post('/getBomForOpVersionMoProductFgColor')
    async getBomForOpVersionMoProductFgColor(@Body() reqObj: any): Promise<MOC_MoBomModelResponse> {
        try {
            return await this.service.getBomForOpVersionMoProductFgColor(reqObj);
        } catch (error) {
            return returnException(MOC_MoBomModelResponse, error)
        }
    }

    @ApiBody({ type: MOC_MoProductFabConsumptionRequest })
    @Post('/saveFabConsumptionForMoProduct')
    async saveFabConsumptionForMoProduct(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.saveFabConsumptionForMoProduct(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: MOC_MoProdCodeRequest })
    @Post('/getFabConsumptionForMoProduct')
    async getFabConsumptionForMoProduct(@Body() reqObj: any): Promise<MOC_MoProductFabConsResponse> {
        try {
            return await this.service.getFabConsumptionForMoProduct(reqObj);
        } catch (error) {
            return returnException(MOC_MoProductFabConsResponse, error)
        }
    }

    @ApiBody({ type: MOC_MoOrderRevisionRequest })
    @Post('/saveOrderRevisionForMo')
    async saveOrderRevisionForMo(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.saveOrderRevisionForMo(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: MOC_MoOrderRevisionRequest })
    @Post('/getOrderRevisionForMo')
    async getOrderRevisionForMo(@Body() reqObj: any): Promise<MOC_MoOrderRevisionResponse> {
        try {
            return await this.service.getOrderRevisionForMo(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: MC_MoNumberRequest })
    @Post('/createProcessingBundlesForMO')
    async createProcessingBundlesForMO(@Body() reqObj: MC_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.moPoBundleService.createProcessingBundlesForMO(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: MC_MoProcessTypeModel })
    @Post('/getEligibleBundleInfoToCreatePO')
    async getEligibleBundleInfoToCreatePO(@Body() reqObj: MC_MoProcessTypeModel): Promise<ProductSubLineAndBundleDetailResponse> {
        try {
            return await this.moPoBundleService.getEligibleBundleInfoToCreatePO(reqObj);
        } catch (error) {
            return returnException(ProductSubLineAndBundleDetailResponse, error);
        }
    }

    @ApiBody({ type: MC_PoPslbBundleDetailModel })
    @Post('/updateProcessSerialToBundles')
    async updateProcessSerialToBundles(@Body() reqObj: MC_PoPslbBundleDetailModel): Promise<GlobalResponseObject> {
        try {
            return await this.moPoBundleService.updateProcessSerialToBundles(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: MC_StyleMoNumbersRequest })
    @Post('/checkAndGetBundleGroupsForGivenMos')
    async checkAndGetBundleGroupsForGivenMos(@Body() reqObj: MC_StyleMoNumbersRequest): Promise<RoutingGroupDetailsResponse> {
        try {
            return await this.moOpRoutingService.checkAndGetBundleGroupsForGivenMos(reqObj);
        } catch (error) {
            console.log(error)

            return returnException(RoutingGroupDetailsResponse, error);
        }
    }


    @ApiBody({ type: MC_ProductSubLineProcessTypeRequest })
    @Post('/getSizeWiseComponentConsumptionForSubLineIds')
    async getSizeWiseComponentConsumptionForSubLineIds(@Body() reqObj: MC_ProductSubLineProcessTypeRequest): Promise<MOC_MoProductFabConsResponse> {
        try {
            return await this.service.getSizeWiseComponentConsumptionForSubLineIds(reqObj);
        } catch (error) {
            return returnException(MOC_MoProductFabConsResponse, error);
        }
    }

    @ApiBody({ type: MC_ProductSubLineProcessTypeRequest })
    @Post('/getKnitGroupInfoForMOProductSubLineDetails')
    async getKnitGroupInfoForMOProductSubLineDetails(@Body() reqObj: MC_ProductSubLineProcessTypeRequest): Promise<MOC_OpRoutingResponse> {
        try {
            return await this.moOpRoutingService.getKnitGroupInfoForMOProductSubLineDetails(reqObj);
        } catch (error) {
            return returnException(MOC_OpRoutingResponse, error);
        }
    }


    @ApiBody({ type: MOCProductFgColorVersionRequest })
    @Post('/getCurrentVersionForGivenProductDetail')
    async getCurrentVersionForGivenProductDetail(@Body() reqObj: MOCProductFgColorVersionRequest): Promise<OpVersionAbstractResponse> {
        try {
            return await this.moOpRoutingService.getCurrentVersionForGivenProductDetail(reqObj);
        } catch (error) {
            return returnException(OpVersionAbstractResponse, error);
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/confirmMoProceeding')
    async confirmMoProceeding(@Body() reqObj: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.confirmMoProceeding(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/unConfirmMoProceedingForOMS')
    async unConfirmMoProceedingForOMS(@Body() reqObj: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.unConfirmMoProceedingForOMS(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/unConfirmMoProceeding')
    async unConfirmMoProceeding(@Body() reqObj: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.unConfirmMoProceeding(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/getAndSaveMoProductFgColorForMO')
    async getAndSaveMoProductFgColorForMO(@Body() reqObj: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.moProductFgColorService.getAndSaveMoProductFgColorForMO(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: MoProductSubLineIdsRequest })
    @Post('/getEligibleBundleInfoForGivenSubLineIds')
    async getEligibleBundleInfoForGivenSubLineIds(@Body() reqObj: MoProductSubLineIdsRequest): Promise<ProductSubLineAndBundleDetailResponse> {
        try {
            return await this.moPoBundleService.getEligibleBundleInfoForGivenSubLineIds(reqObj);
        } catch (error) {
            return returnException(ProductSubLineAndBundleDetailResponse, error);
        }
    }

    @ApiBody({ type: MC_ProductSubLineProcessTypeRequest })
    @Post('/getRoutingGroupInfoForMOProductSubLineDetails')
    async getRoutingGroupInfoForMOProductSubLineDetails(@Body() reqObj: MC_ProductSubLineProcessTypeRequest): Promise<MOC_OpRoutingResponse> {
        try {
            return await this.moOpRoutingService.getRoutingGroupInfoForMOProductSubLineDetails(reqObj);
        } catch (error) {
            return returnException(MOC_OpRoutingResponse, error);
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/getOperationsListInfoForMo')
    async getOperationsListInfoForMo(@Body() reqObj: SI_MoNumberRequest): Promise<OMS_R_MoOperationsListInfoResponse> {
        try {
            return await this.moOpRoutingService.getOperationsListInfoForMo(reqObj);
        } catch (error) {
            console.log(error);
            return returnException(OMS_R_MoOperationsListInfoResponse, error);
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/checkGivenMOsHavingSameOpVersions')
    async checkGivenMOsHavingSameOpVersions(@Body() reqObj: MoProductFgColorReq[]): Promise<OpVersionCheckResponse> {
        try {
            return await this.moOpRoutingService.checkGivenMOsHavingSameOpVersions(reqObj);
        } catch (error) {
            return returnException(OpVersionCheckResponse, error);
        }
    }

    @ApiBody({ type: ProcessingOrderSerialRequest })
    @Post('/unMapProcessingSerialsToBundles')
    async unMapProcessingSerialsToBundles(@Body() reqObj: ProcessingOrderSerialRequest): Promise<GlobalResponseObject> {
        try {
            return await this.moPoBundleService.unMapProcessingSerialsToBundles(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: ProcessingOrderSerialRequest })
    @Post('/getMoPlannedBundlesFromRequest')
    async getMoPlannedBundlesFromRequest(@Body() req: MC_MoNumberRequest): Promise<PlannedBundleResponseModel> {
        try {
            return await this.moPoBundleService.getMoPlannedBundlesFromRequest(req);
        } catch (error) {
            return returnException(PlannedBundleResponseModel, error);
        }
    }
}