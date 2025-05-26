import { Body, Controller, Post } from '@nestjs/common';
import { returnException } from '@xpparel/backend-utils';
import { KnitHeaderInfoResoponse, MC_MoNumberRequest, MC_ProductSubLineBundleCountDetail, MoPslIdsRequest, MoPslQtyInfoResponse, PBUN_C_ProcOrderRequest, PBUN_R_ProcBundlesResponse, PBUN_R_ProcJobBundlesResponse, PO_PoSerialRequest, PO_StyleInfoResponse, PoDataSummaryResponse, ProcessingOrderCreationInfoResponse, ProcessingOrderCreationRequest, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderSerialRequest, ProcessTypeEnum, ProductInfoResponse, SewingIJobNoRequest, SewitemCodeWiseConsumptionResponse, SewJobBundleSheetResponse, SewSerialRequest, SpsBundleSheetRequest, StyleCodeRequest, StyleMoRequest, StyleProductCodeRequest, StyleProductFgColorResp } from '@xpparel/shared-models';
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

    @Post('/createSPSProcessingOrder')
    async createSPSProcessingOrder(@Body() reqObj: ProcessingOrderCreationRequest): Promise<ProcessingOrderInfoResponse> {
        try {
            return await this.poService.createSPSProcessingOrder(reqObj);
        } catch (error) {
            console.log('po error',error)
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
     * Service to get Sew Order Created Styles 
     * Usually calls from the UI, to display styles dropdown
     * @param reqObj 
     * @returns 
    */
    @Post('/getSewOrderCreatedStyles')
    async getSewOrderCreatedStyles(@Body() reqObj: StyleMoRequest): Promise<PO_StyleInfoResponse> {
        try {
            return await this.poInfoService.getSewOrderCreatedStyles(reqObj);
        } catch (error) {
            return returnException(PO_StyleInfoResponse, error);
        }
    }

    /**
     * 
     * Service to get Sew Order Created Product Info for given style
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
     * Service to get Sew Order Info for Style and product
     * Usually calls from UI to Display processing orders for given style and product code
     * @param reqObj 
     * @returns 
    */
    @Post('/getSPSOrderInfoByStyeAndProduct')
    async getSPSOrderInfoByStyeAndProduct(@Body() reqObj: StyleProductCodeRequest): Promise<ProcessingOrderInfoResponse> {
        try {
            return await this.poInfoService.getSPSOrderInfoByStyeAndProduct(reqObj);
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

    @Post('/getProcOrderBundlesForProcSerialAndPslIds')
    async getProcOrderBundlesForProcSerialAndPslIds(@Body() req: PBUN_C_ProcOrderRequest): Promise<PBUN_R_ProcBundlesResponse> {
        try {
            return await this.poBundleService.getProcOrderBundlesForProcSerialAndPslIds(req);
        } catch (error) {
            return returnException(PBUN_R_ProcBundlesResponse, error);
        }
    }

    @Post('/getJobBundlesForProcSerialAndPslIds')
    async getJobBundlesForProcSerialAndPslIds(@Body() req: PBUN_C_ProcOrderRequest): Promise<PBUN_R_ProcJobBundlesResponse> {
        try {
            return await this.poBundleService.getJobBundlesForProcSerialAndPslIds(req);
        } catch (error) {
            return returnException(PBUN_R_ProcJobBundlesResponse, error);
        }
    }

    @Post('/getHeaderInfoForSewSerial')
    async getHeaderInfoForSewSerial(@Body() req: SewSerialRequest): Promise<KnitHeaderInfoResoponse> {
        try {
            return await this.poService.getHeaderInfoForSewSerial(req.poSerial, req.companyCode, req.unitCode);
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

    @Post('/createBundlesForPoAndBundleGroup')
    async createBundlesForPoAndBundleGroup(@Body() reqObj: PO_PoSerialRequest): Promise<ProcessingOrderInfoResponse> {
        try {
            return await this.poBundleService.createBundlesForPoAndBundleGroup(reqObj);
        } catch (error) {
            console.log('po error',error)
            return returnException(ProcessingOrderInfoResponse, error);
        }
    }

    @Post('/getObjectWiseDataByJobNumber')
    async getObjectWiseDataByJobNumber(@Body() req: SpsBundleSheetRequest): Promise<SewJobBundleSheetResponse> {
        try {
            return await this.poInfoService.getObjectWiseDataByJobNumber(req);
        } catch (error) {
            return returnException(SewJobBundleSheetResponse, error);
        }
    }

    @Post('/getItemCodeWiseConsumptionByJobNumber')
    async getItemCodeWiseConsumptionByJobNumber(@Body() req: SpsBundleSheetRequest): Promise<SewitemCodeWiseConsumptionResponse> {
        try {
            return await this.poInfoService.getItemCodeWiseConsumptionByJobNumber(req);
        } catch (error) {
            return returnException(SewitemCodeWiseConsumptionResponse, error);
        }
    }
}
