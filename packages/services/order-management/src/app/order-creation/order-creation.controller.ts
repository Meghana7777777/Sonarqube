import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { CommonRequestAttrs, GlobalResponseObject, MOHeaderInfoModelResponse, MOPreviewResponse, MOSummaryPreviewResponse, MO_R_OslBundlesResponse, ManufacturingOrderDumpRequest, MoCombinationRequest, MoCombinationWithPslIdsResponse, MoNumberDropdownResponse, MoPslIdsOrderFeaturesResponse, MoPslIdsRequest, MoSummaryPreviewData, SI_ManufacturingOrderInfoAbstractResponse, SI_ManufacturingOrderInfoResponse, SI_MoNumberRequest, SI_MoProductIdRequest, SI_MoProductSubLineIdsRequest, StyleCodeRequest, StyleProductFgColorResp } from '@xpparel/shared-models';
import { OrderCreationInfoService } from './order-creation-info.service';
import { OrderCreationService } from './order-creation.service';

@ApiTags('Order Creation Module')
@Controller('order-creation')
export class OrderCreationController {
    constructor(
        private service: OrderCreationService,
        private infoService: OrderCreationInfoService
    ) {

    }

    // @ApiBody({ type: SupplierCodeReq })
    // @Post('/saveMo')
    // async getOrderInformationFromDump(@Body() reqObj: any): Promise<ItemCodeInfoResponse> {
    //     try {
    //         // return await this.service.getOrderInformationFromDump(reqObj);
    //     } catch (error) {
    //         return returnException(ItemCodeInfoResponse, error)
    //     }
    // }


    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getManufacturingOrdersList')
    async getManufacturingOrdersList(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoAbstractResponse> {
        try {
            return await this.infoService.getManufacturingOrdersList(reqObj);
        } catch (error) {
            return returnException(SI_ManufacturingOrderInfoAbstractResponse, error)
        }
    }

    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getUnConfirmedManufacturingOrdersInfo')
    async getUnConfirmedManufacturingOrdersInfo(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
        try {
            return await this.infoService.getUnConfirmedManufacturingOrdersInfo(reqObj);
        } catch (error) {
            return returnException(SI_ManufacturingOrderInfoResponse, error)
        }
    }

    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getConfirmedManufacturingOrdersInfo')
    async getConfirmedManufacturingOrdersInfo(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
        try {
            return await this.infoService.getConfirmedManufacturingOrdersInfo(reqObj);
        } catch (error) {
            return returnException(SI_ManufacturingOrderInfoResponse, error)
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/getOrderInfoByManufacturingOrderNo')
    async getOrderInfoByManufacturingOrderNo(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
        try {
            return await this.infoService.getOrderInfoByManufacturingOrderNo(reqObj);
        } catch (error) {
            return returnException(SI_ManufacturingOrderInfoResponse, error)
        }
    }


    @ApiBody({ type: ManufacturingOrderDumpRequest })
    @Post('/upLoadOrders')
    async upLoadOrders(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.upLoadOrders(reqObj);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/deleteOrders')
    async deleteOrders(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteOrders(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/confirmManufacturingOrder')
    async confirmManufacturingOrder(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.confirmManufacturingOrder(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/getDistinctProductFgColorInfoForMO')
    async getDistinctProductFgColorInfoForMO(@Body() reqObj: any): Promise<StyleProductFgColorResp> {
        try {
            return await this.infoService.getDistinctProductFgColorInfoForMO(reqObj);
        } catch (error) {
            return returnException(StyleProductFgColorResp, error)
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/getOrderInfoByManufacturingOrderProductCodeFgColor')
    async getOrderInfoByManufacturingOrderProductCodeFgColor(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
        try {
            return await this.infoService.getOrderInfoByManufacturingOrderProductCodeFgColor(reqObj);
        } catch (error) {
            return returnException(SI_ManufacturingOrderInfoResponse, error)
        }
    }


    @ApiBody({ type: SI_MoProductSubLineIdsRequest })
    @Post('/getMoInfoByPslId')
    async getMoInfoByPslId(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
        try {
            return await this.infoService.getMoInfoByPslId(reqObj);
        } catch (error) {
            return returnException(SI_ManufacturingOrderInfoResponse, error)
        }
    }

    @ApiBody({ type: StyleCodeRequest })
    @Post('/getMoNumbersForStyleCode')
    async getMoNumbersForStyleCode(@Body() reqObj: any): Promise<MoNumberDropdownResponse> {
        try {
            return await this.infoService.getMoNumbersForStyleCode(reqObj);
        } catch (error) {
            return returnException(MoNumberDropdownResponse, error)
        }
    }


    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getOpenMo')
    async getOpenMo(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
        try {
            return await this.infoService.getOpenMo(reqObj);
        } catch (error) {
            return returnException(SI_ManufacturingOrderInfoResponse, error)
        }
    }

    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getInProgressMo')
    async getInProgressMo(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
        try {
            return await this.infoService.getInProgressMo(reqObj);
        } catch (error) {
            return returnException(SI_ManufacturingOrderInfoResponse, error)
        }
    }


    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getClosedMo')
    async getClosedMo(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
        try {
            return await this.infoService.getClosedMo(reqObj);
        } catch (error) {
            return returnException(SI_ManufacturingOrderInfoResponse, error)
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/proceedOpenToInprogress')
    async proceedOpenToInprogress(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.infoService.proceedOpenToInprogress(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: SI_MoProductIdRequest })
    @Post('/getMoInfoHeader')
    async getMoInfoHeader(@Body() reqObj: any): Promise<MOHeaderInfoModelResponse> {
        try {
            return await this.infoService.getMoInfoHeader(reqObj); // do not forget to edit 
        } catch (error) {
            return returnException(MOHeaderInfoModelResponse, error)
        }
    }

    @ApiBody({ type: SI_MoProductSubLineIdsRequest })
    @Post('/getBundlesForPslId')
    async getBundlesForPslId(@Body() reqObj: any): Promise<MO_R_OslBundlesResponse> {
        try {
            return await this.infoService.getBundlesForPslId(reqObj); // do not forget to edit 
        } catch (error) {
            return returnException(MO_R_OslBundlesResponse, error)
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/getMoPreviewData')
    async getMoPreviewData(@Body() reqObj: any): Promise<MOPreviewResponse> {
        try {
            return await this.infoService.getMoPreviewData(reqObj);
        } catch (error) {
            return returnException(MOPreviewResponse, error)
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/getMoSummaryPreviewData')
    async getMoSummaryPreviewData(@Body() reqObj: any): Promise<MOSummaryPreviewResponse> {
        try {
            return await this.infoService.getMoSummaryPreviewData(reqObj);
        } catch (error) {
            return returnException(MOSummaryPreviewResponse, error)
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/checkAndSaveItemsForMO')
    async checkAndSaveItemsForMO(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.checkAndSaveItemsForMO(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: MoCombinationRequest })
    @Post('/getPslIdsForMoCombinations')
    async getPslIdsForMoCombinations(@Body() reqObj: any): Promise<MoCombinationWithPslIdsResponse> {
        try {
            return await this.service.getPslIdsForMoCombinations(reqObj);
        } catch (error) {
            return returnException(MoCombinationWithPslIdsResponse, error)
        }
    }

    @ApiBody({ type: MoPslIdsRequest })
    @Post('/getOrderFeaturesForGivenPslIds')
    async getOrderFeaturesForGivenPslIds(@Body() reqObj: any): Promise<MoPslIdsOrderFeaturesResponse> {
        try {
            return await this.service.getOrderFeaturesForGivenPslIds(reqObj);
        } catch (error) {
            return returnException(MoPslIdsOrderFeaturesResponse, error)
        }
    }

    


}