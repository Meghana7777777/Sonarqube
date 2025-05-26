import { Body, Controller, Post } from '@nestjs/common';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, KJ_KnitJobLocPlanRequest, KnitHeaderInfoResoponse, MC_MoNumberRequest, MC_ProductSubLineBundleCountDetail, MO_R_OslBundlesResponse, MoCustomerInfoHelperResponse, MoPslIdsRequest, MoPslQtyInfoResponse, OES_C_PoProdColorRequest, OES_R_PoOrderQtysResponse, PO_C_PoSerialPslIdsRequest, PO_PoSerialRequest, PO_StyleInfoResponse, PoDataSummaryResponse, PoProdNameResponse, PoSerialRequest, PoSizesResponse, PoSummaryResponse, ProcessingOrderCreationInfoResponse, ProcessingOrderCreationRequest, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderSerialRequest, ProcessTypeEnum, ProductInfoResponse, RawOrderNoRequest, SewSerialRequest, StyleCodeRequest, StyleMoRequest, StyleProductCodeRequest, StyleProductFgColorResp } from '@xpparel/shared-models';
import { PoSubLineBundleService } from './po-sub-line.bundle.service';
import { ProcessingOrderInfoService } from './processing-order-info.service';
import { ProcessingOrderService } from './processing-order.service';
import { PoInfoService } from './po-info.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('processing-order')
export class ProcessingOrderController {
    constructor(
        private poService: ProcessingOrderService,
        private poInfoService: ProcessingOrderInfoService,
        private poBundleService: PoSubLineBundleService,
        private infoService: PoInfoService
    ) {

    }

    @Post('/createCutProcessingOrder')
    async createCutProcessingOrder(@Body() reqObj: ProcessingOrderCreationRequest): Promise<ProcessingOrderInfoResponse> {
        try {
            return await this.poService.createCutProcessingOrder(reqObj);
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
    @Post('/getCutOrderCreatedStyles')
    async getCutOrderCreatedStyles(@Body() reqObj: StyleMoRequest): Promise<PO_StyleInfoResponse> {
        try {
            return await this.poInfoService.getCutOrderCreatedStyles(reqObj);
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
    @Post('/getCutOrderInfoByStyeAndProduct')
    async getCutOrderInfoByStyeAndProduct(@Body() reqObj: StyleProductCodeRequest): Promise<ProcessingOrderInfoResponse> {
        try {
            return await this.poInfoService.getCutOrderInfoByStyeAndProduct(reqObj);
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
            return await this.poBundleService.getEligibleProductSubLinesToCreatePo(reqObj, [ProcessTypeEnum.CUT]);
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


    @Post('/deleteCutProcesisngOrder')
    async deleteCutProcesisngOrder(@Body() reqObj: ProcessingOrderSerialRequest): Promise<GlobalResponseObject> {
        try {
            return await this.poService.deleteCutProcesisngOrder(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    @Post('/getMoHeaderInfoData')
    async getMoHeaderInfoData(@Body() req: KJ_KnitJobLocPlanRequest): Promise<KnitHeaderInfoResoponse> {
        try {
            console.log(req.processingSerial);
            return await this.poInfoService.getMoHeaderInfoData(req.processingSerial, req.companyCode, req.unitCode);
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

    // @Post('/getPoSummary')
    // async getPoSummary(@Body() req: ProcessingOrderSerialRequest): Promise<PoDataSummaryResponse> {
    //     try {
    //         return await this.poInfoService.getPoSummary(req);
    //     } catch (error) {
    //         return returnException(PoDataSummaryResponse, error);
    //     }
    // }


    /**
         * READER
         * get the PO summary
         * @param req 
         * @returns 
         */
    @ApiBody({ type: PoSerialRequest })
    @Post('/getPoSummary')
    async getPoSummary(@Body() req: any): Promise<PoSummaryResponse> {
        try {
            return await this.infoService.getPoSummary(req);
        } catch (err) {
            console.log(err);
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * READER
     * get the POs for the SO
     * @param req 
     * @returns 
     */
    @ApiBody({ type: RawOrderNoRequest })
    @Post('/getPosForMo')
    async getPosForMo(@Body() req: any): Promise<PoSummaryResponse> {
        try {
            return await this.infoService.getPosForMo(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * gets the sizes for the given po
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoSerialRequest })
    @Post('/getPoLineLevelSizeQtys')
    async getPoLineLevelSizeQtys(@Body() req: any): Promise<PoSizesResponse> {
        try {
            return await this.infoService.getPoLineLevelSizeQtys(req);
        } catch (err) {
            return returnException(PoSizesResponse, err);
        }
    }

    /**
     * gets the po product names
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoSerialRequest })
    @Post('/getPoProductNames')
    async getPoProductNames(@Body() req: any): Promise<PoProdNameResponse> {
        try {
            return await this.infoService.getPoProductNames(req);
        } catch (err) {
            return returnException(PoProdNameResponse, err);
        }
    }

    /**
     * READER
     * get the PO summary
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoSerialRequest })
    @Post('/getPoBasicInfoByPoSerial')
    async getPoBasicInfoByPoSerial(@Body() req: any): Promise<PoSummaryResponse> {
        try {
            return await this.infoService.getPoBasicInfoByPoSerial(req.poSerial, req.unitCode, req.companyCode);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    @ApiBody({ type: PO_PoSerialRequest })
    @Post('/getAndSavePoMaterialInfo')
    async getAndSavePoMaterialInfo(@Body() req: PO_PoSerialRequest): Promise<GlobalResponseObject> {
        try {
            return await this.poService.getAndSavePoMaterialInfo(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }


    @ApiBody({ type: ProcessingOrderSerialRequest })
    @Post('/getPoSummaryInfoForPoSerial')
    async getPoSummaryInfoForPoSerial(@Body() req: ProcessingOrderSerialRequest): Promise<PoSummaryResponse> {
        try {
            return await this.infoService.getPoSummaryInfoForPoSerial(req);
        } catch (err) {
            return returnException(PoSummaryResponse, err);
        }
    }


    @ApiBody({ type: PO_PoSerialRequest })
    @Post('/getAndSavePoOperationsInfo')
    async getAndSavePoOperationsInfo(@Body() req: PO_PoSerialRequest): Promise<GlobalResponseObject> {
        try {
            return await this.poService.getAndSavePoOperationsInfo(req);
        } catch (err) {
            console.log(err);
            return returnException(GlobalResponseObject, err);
        }
    }

    @Post('/getCutHeaderInfoForProcSerial')
    async getCutHeaderInfoForProcSerial(@Body() req: PO_PoSerialRequest): Promise<KnitHeaderInfoResoponse> {
        try {
            return await this.poService.getCutHeaderInfoForProcSerial(req.processingSerial, req.companyCode, req.unitCode);
        } catch (error) {
            return returnException(KnitHeaderInfoResoponse, error);
        }
    };

    @Post('/populateSizePropsForPoSerial')
    async populateSizePropsForPoSerial(@Body() req: PO_PoSerialRequest): Promise<any> {
        try {
            return await this.poService.populateSizePropsForPoSerial(req.processingSerial, req.companyCode, req.unitCode, req.username);
        } catch (error) {
            return returnException(KnitHeaderInfoResoponse, error);
        }
    }

    @Post('/getMoCustomerPoInfoForPoSerial')
    async getMoCustomerPoInfoForPoSerial(@Body() req: PO_PoSerialRequest): Promise<MoCustomerInfoHelperResponse> {
        try {
            return await this.infoService.getMoCustomerPoInfoForPoSerial(req.processingSerial, req.companyCode, req.unitCode);
        } catch (error) {
            return returnException(MoCustomerInfoHelperResponse, error);
        }
    }

    @Post('/getPslBundlesForPoSerial')
    async getPslBundlesForPoSerial(@Body() req: PO_C_PoSerialPslIdsRequest): Promise<MO_R_OslBundlesResponse> {
        try {
            return await this.poInfoService.getPslBundlesForPoSerial(req);
        } catch (error) {
            return returnException(MO_R_OslBundlesResponse, error);
        }
    }

    @Post('/getMoInfoByProcessingSerial')
    async getMoInfoByProcessingSerial(@Body() req: PO_PoSerialRequest): Promise<MoCustomerInfoHelperResponse> {
        try {
            return await this.poInfoService.getMoInfoByProcessingSerial(req);
        } catch (error) {
            return returnException(MoCustomerInfoHelperResponse, error);
        }
    }

    @Post('/getCutOrderQtysForPoProdColor')
    async getCutOrderQtysForPoProdColor(@Body() req: OES_C_PoProdColorRequest): Promise<OES_R_PoOrderQtysResponse> {
        try {
            return await this.infoService.getCutOrderQtysForPoProdColor(req);
        } catch (error) {
            console.log(error);
            return returnException(OES_R_PoOrderQtysResponse, error);
        }
    }
}
