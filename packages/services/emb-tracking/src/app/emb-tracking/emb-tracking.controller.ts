import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, EmbBundleScanRequest, EmbBundleScanResponse, EmbJobBundleResponse, EmbJobNumberOpCodeRequest, EmbJobNumberRequest, GlobalResponseObject, ItemCodeInfoResponse, JobScanQtyBasicResponse, LayIdsRequest, OpenPoDetailsResponse, OrderPtypeMapRequest, PoDocketNumberRequest, PoDocketNumbersRequest, PoDocketOpCodeRequest, PoNumberRequest, ProductIdRequest, ProductItemResponse, RawOrderIdRequest, RawOrderNoRequest, ManufacturingOrderResp, MoDumpModal, SubProductItemMapRequest, SupplierCodeReq, SupplierInfoResponse } from '@xpparel/shared-models';
import { EmbTrackingService } from './emb-tracking.service';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { EmbTrackingInfoService } from './emb-tracking-info.service';


@ApiTags('EmbTracking')
@Controller('emb-tracking')
export class EmbTrackingController {
    constructor(
        private service: EmbTrackingService,
        private infoService: EmbTrackingInfoService,
    ) {

    }

    /**
     * Usually not used
     * Called manually in case of a failure in creating the emb tracking records
     * @param req 
     * @returns 
     */
    @ApiBody({ type: EmbJobNumberRequest })
    async createEmbTrackingInfo(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.createEmbTrackingInfo(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    // @ApiBody({type: })
    @Post('/getEmbBundleTrackingInfo')
    async getEmbBundleTrackingInfo(@Body() req: any): Promise<GlobalResponseObject> {
        try {
           return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * reports the emb bundle
     * Used for Good / Rejections
     * @param param
     */
    @ApiBody({type: EmbBundleScanRequest})
    @Post('/reportEmbBundle')
    async reportEmbBundle(@Body() req: any): Promise<EmbBundleScanResponse> {
        try {
            return await this.service.reportEmbBundle(req);
        } catch (error) {
            console.log(error);
            return returnException(EmbBundleScanResponse, error);
        }
    }

    /**
     * reports the emb bundle reversal
     * Used for Good reversal only
     * @param param 
     */
    @ApiBody({type: EmbBundleScanRequest})
    @Post('/reportEmbBundleReversal')
    async reportEmbBundleReversal(@Body() req: any): Promise<EmbBundleScanResponse> {
        try {
            return await this.service.reportEmbBundleReversal(req);
        } catch (error) {
            console.log(error);
            return returnException(EmbBundleScanResponse, error);
        }
    }

    /**
     * reports the emb rejection reversal
     * Used for rej reversal only
     * @param param 
     */
    @ApiBody({type: EmbBundleScanRequest})
    @Post('/reportEmbBundleRejReversal')
    async reportEmbBundleRejReversal(@Body() req: any): Promise<EmbBundleScanResponse> {
        try {
            return await this.service.reportEmbBundleRejReversal(req);
        } catch (error) {
            return returnException(EmbBundleScanResponse, error);
        }
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    @ApiBody({type: PoDocketOpCodeRequest})
    @Post('/getEmbJobBundlesInfo')
    async getEmbJobBundlesInfo(@Body() req: any): Promise<EmbJobBundleResponse> {
        try {
            return await this.infoService.getEmbJobBundlesInfo(req);
        } catch (error) {
            console.log(error);
            return returnException(EmbJobBundleResponse, error);
        }
    }

    // Updater
    // Not required in the shared services
    // Bull JOB consumer
    @ApiBody({type: EmbJobNumberOpCodeRequest})
    @Post('/updateEmbJobOperationQty')
    async updateEmbJobOperationQty(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.updateEmbJobOperationQty(req);
        } catch (error) {
            console.log(error);
            return returnException(EmbJobBundleResponse, error);
        }
    }

    // Reader
    @ApiBody({type: PoDocketNumbersRequest})
    @Post('/getEmbJobWiseReportedQtysForRefJobNos')
    async getEmbJobWiseReportedQtysForRefJobNos(@Body() req: any): Promise<JobScanQtyBasicResponse> {
        try {
            return await this.infoService.getEmbJobWiseReportedQtysForRefJobNos(req);
        } catch (error) {
            console.log(error);
            return returnException(JobScanQtyBasicResponse, error);
        }
    }

}




