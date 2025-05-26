import { Body, Controller, Post } from '@nestjs/common';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, KJ_KnitJobLocPlanRequest, KnitHeaderInfoResoponse, MC_MoNumberRequest, MC_ProductSubLineBundleCountDetail, MoPslIdsRequest, MoPslQtyInfoResponse, PO_PoSerialRequest, PO_StyleInfoResponse, PoDataSummaryResponse, ProcessingOrderCreationInfoResponse, ProcessingOrderCreationRequest, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderSerialRequest, ProcessTypeEnum, ProductInfoResponse, StyleCodeRequest, StyleMoRequest, StyleProductCodeRequest, StyleProductFgColorResp } from '@xpparel/shared-models';
import { PoSubLineBundleService } from './po-sub-line.bundle.service';
import { ProcessingOrderInfoService } from './processing-order-info.service';
import { ProcessingOrderService } from './processing-order.service';

@Controller('processing-order')
export class ProcessingOrderController {
    constructor(
        private poService: ProcessingOrderService,
        private poInfoService: ProcessingOrderInfoService,
        private poBundleService: PoSubLineBundleService
    ) {

    }

    @Post('/createKnitProcessingOrder')
    async createKnitProcessingOrder(@Body() reqObj: ProcessingOrderCreationRequest): Promise<ProcessingOrderInfoResponse> {
        try {
            return await this.poService.createKnitProcessingOrder(reqObj);
        } catch (error) {
            return returnException(ProcessingOrderInfoResponse, error);
        }
    }

    @Post('/getPoInfoForStyleAndMo')
    async getPoInfoForStyleAndMo(@Body() reqObj: StyleMoRequest): Promise<ProcessingOrderInfoResponse> {
        try {
            return await this.poInfoService.getPoInfoForStyleAndMo(reqObj);
        } catch (error) {
            return returnException(ProcessingOrderInfoResponse, error);
        }
    }

    @Post('/getProcessingOrderInfo')
    async getProcessingOrderInfo(@Body() reqObj: ProcessingOrderInfoRequest): Promise<ProcessingOrderInfoResponse> {
        try {
            return await this.poInfoService.getProcessingOrderInfo(reqObj);
        } catch (error) {
            return returnException(ProcessingOrderInfoResponse, error);
        }
    }

    @Post('/getMOInfoForPrcOrdCreation')
    async getMOInfoForPrcOrdCreation(@Body() reqObj: StyleMoRequest): Promise<ProcessingOrderCreationInfoResponse> {
        try {
            return await this.poInfoService.getMOInfoForPrcOrdCreation(reqObj);
        } catch (error) {
            return returnException(ProcessingOrderCreationInfoResponse, error);
        }
    }



    /**
     * Service to get Knit Order Created Styles 
     * Usually calls from the UI, to display styles dropdown
     * @param reqObj 
     * @returns 
    */
    @Post('/getKnitOrderCreatedStyles')
    async getKnitOrderCreatedStyles(@Body() reqObj: StyleMoRequest): Promise<PO_StyleInfoResponse> {
        try {
            return await this.poInfoService.getKnitOrderCreatedStyles(reqObj);
        } catch (error) {
            return returnException(PO_StyleInfoResponse, error);
        }
    }

    /**
     * 
     * Service to get Knit Order Created Product Info for given style
     * Usually calls from UI to display products against to given style (dependent dropdown)
     * @param reqObj 
     * @returns 
    */
    @Post('/getProductInfoForGivenStyle')
    async getProductInfoForGivenStyle(@Body() reqObj: StyleCodeRequest): Promise<ProductInfoResponse> {
        try {
            return await this.poInfoService.getProductInfoForGivenStyle(reqObj);
        } catch (error) {
            return returnException(ProductInfoResponse, error);
        }
    }

    /**
     * Service to get Knit Order Info for Style and product
     * Usually calls from UI to Display processing orders for given style and product code
     * @param reqObj 
     * @returns 
    */
    @Post('/getKnitOrderInfoByStyeAndProduct')
    async getKnitOrderInfoByStyeAndProduct(@Body() reqObj: StyleProductCodeRequest): Promise<ProcessingOrderInfoResponse> {
        try {
            return await this.poInfoService.getKnitOrderInfoByStyeAndProduct(reqObj);
        } catch (error) {
            return returnException(ProcessingOrderInfoResponse, error);
        }
    }

    /**
    * Service to get style and product code information for fg color and Po
    * Usually calls from UI to show the tabs for each product code and fg color
    * @param reqObj 
    * @returns 
   */
    @Post('/getStyleProductCodeFgColorForPo')
    async getStyleProductCodeFgColorForPo(@Body() reqObj: ProcessingOrderSerialRequest): Promise<StyleProductFgColorResp> {
        try {
            return await this.poInfoService.getStyleProductCodeFgColorForPo(reqObj);
        } catch (error) {
            return returnException(StyleProductFgColorResp, error);
        }
    }


    @Post('/getEligibleProductSubLinesToCreatePo')
    async getEligibleProductSubLinesToCreatePo(@Body() reqObj: MC_MoNumberRequest): Promise<MC_ProductSubLineBundleCountDetail[]> {
        try {
            return await this.poBundleService.getEligibleProductSubLinesToCreatePo(reqObj, [ProcessTypeEnum.KNIT]);
        } catch (error) {
            // return returnException(MC_ProductSubLineBundleCountDetail[], error);
            return error;
        }
    }

    @Post('/createBundlesForPo')
    async createBundlesForPo(@Body() reqObj: PO_PoSerialRequest): Promise<GlobalResponseObject> {
        try {
            return await this.poBundleService.createBundlesForPo(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    @Post('/deleteKnitProcesisngOrder')
    async deleteKnitProcesisngOrder(@Body() reqObj: ProcessingOrderSerialRequest): Promise<GlobalResponseObject> {
        try {
            return await this.poService.deleteKnitProcesisngOrder(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    @Post('/getKnitHeaderInfoData')
    async getKnitHeaderInfoData(@Body() req: KJ_KnitJobLocPlanRequest): Promise<KnitHeaderInfoResoponse> {
        try {
            console.log(req.processingSerial);
            return await this.poInfoService.getKnitHeaderInfoData(req.processingSerial, req.companyCode, req.unitCode);
        } catch (error) {
            return returnException(KnitHeaderInfoResoponse, error);
        }
    }

    @Post('/getPoQtysInfoForMoPSLIds')
    async getPoQtysInfoForMoPSLIds(@Body() req: MoPslIdsRequest): Promise<MoPslQtyInfoResponse> {
        try {
            return await this.poInfoService.getPoQtysInfoForMoPSLIds(req);
        } catch (error) {
            return returnException(MoPslQtyInfoResponse, error);
        }
    }

    @Post('/getPoSummary')
    async getPoSummary(@Body() req: ProcessingOrderSerialRequest): Promise<PoDataSummaryResponse> {
        try {
            return await this.poInfoService.getPoSummary(req);
        } catch (error) {
            return returnException(PoDataSummaryResponse, error);
        }
    }

}
