import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, EmbBarcodePrintRequest, EmbJobNumberRequest, GlobalResponseObject, ItemCodeInfoResponse, LayIdsRequest, OpenPoDetailsResponse, OrderPtypeMapRequest, PoDocketNumberRequest, PoDocketNumbersRequest, PoEmbHeaderResponse, PoNumberRequest, PoSerialWithEmbPrefRequest, ProductIdRequest, ProductItemResponse, RawOrderIdRequest, RawOrderNoRequest, ManufacturingOrderResp, MoDumpModal, SubProductItemMapRequest, SupplierCodeReq, SupplierInfoResponse } from '@xpparel/shared-models';
import { EmbRequestService } from './emb-request.service';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { EmbRequestInfoService } from './emb-request-info.service';


@ApiTags('EmbRequest')
@Controller('emb-request')
export class EmbRequestController {
    constructor(
        private service: EmbRequestService,
        private infoService: EmbRequestInfoService,
    ) {

    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: PoDocketNumberRequest})
    @Post('/createEmbRequest')
    async createEmbRequest(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            /**
             * Based on the docket number, get all the required info from the CPS and create the emb header, emb line, emb barcodes
             * After saving, also save the emb operation and the emb op header
             */
           return await this.service.createEmbRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * Called when doing the cut reversal operation
     * @param req 
     * @returns 
     */
    @ApiBody({type: LayIdsRequest})
    @Post('/deleteEmbLine')
    async deleteEmbLine(@Body() req: any): Promise<GlobalResponseObject> {
        try {
           return await this.service.deleteEmbLine(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * called when doing the docket unconfirmation
     * @param req 
     * @returns 
     */
    @ApiBody({type: PoDocketNumberRequest})
    @Post('/deleteEmbHeader')
    async deleteEmbHeader(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteEmbHeader(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * READER
     * Gets the emb jobs, emb lines and barcodes based on the request
     * @param req 
     * @returns 
     */
    @ApiBody({type: PoSerialWithEmbPrefRequest})
    @Post('/getEmbJobsForPo')
    async getEmbJobsForPo(@Body() req: any): Promise<PoEmbHeaderResponse> {
        try {
            return await this.infoService.getEmbJobsForPo(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * READER
     * Gets the emb jobs, emb lines and barcodes based on the request
     * @param req 
     * @returns 
     */
    @ApiBody({type: EmbJobNumberRequest})
    @Post('/getEmbJobsForEmbJobNumber')
    async getEmbJobsForEmbJobNumber(@Body() req: any): Promise<PoEmbHeaderResponse> {
        try {
            return await this.infoService.getEmbJobsForEmbJobNumber(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * READER
     * Gets the emb jobs, emb lines and barcodes based on the request
     * @param req 
     * @returns 
     */
    @ApiBody({type: EmbJobNumberRequest})
    @Post('/getEmbJobsForEmbLineIds')
    async getEmbJobsForEmbLineIds(@Body() req: any): Promise<PoEmbHeaderResponse> {
        try {
            return await this.infoService.getEmbJobsForEmbLineIds(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * READER
     * Gets the emb jobs, emb lines and barcodes based on the request
     * @param req 
     * @returns 
     */
    @ApiBody({type: EmbBarcodePrintRequest})
    @Post('/printBarcodesForEmbJob')
    async printBarcodesForEmbJob(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            /**
             * Update the supplier id in the emb line
             * update the print status
             * insert the records into the print history table
             */
            return await this.service.printBarcodesForEmbJob(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * READER
     * Gets the emb jobs, emb lines and barcodes based on the request
     * @param req 
     * @returns 
     */
    @ApiBody({type: EmbBarcodePrintRequest})
    @Post('/releaseBarcodesPrintForEmbJob')
    async releaseBarcodesPrintForEmbJob(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            /**
             * Update the supplier id to 0 in the emb line
             * update the print status
             * insert the records into the print history table
             */
            return await this.service.releaseBarcodesPrintForEmbJob(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({type: PoDocketNumbersRequest})
    @Post('/freezeEmbLines')
    async freezeEmbLines(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.freezeEmbLines(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({type: PoDocketNumbersRequest})
    @Post('/unFreezeEmbLines')
    async unFreezeEmbLines(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.freezeEmbLines(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
}