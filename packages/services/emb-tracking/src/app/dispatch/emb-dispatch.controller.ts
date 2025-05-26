import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, EmbDispatchCreateRequest, EmbDispatchIdStatusRequest, EmbDispatchRequestResponse, EmbDispatchStatusRequest, GlobalResponseObject, ItemCodeInfoResponse, OpenPoDetailsResponse, OrderPtypeMapRequest, PoEmbHeaderResponse, PoNumberRequest, ProductIdRequest, ProductItemResponse, RawOrderIdRequest, RawOrderNoRequest, ManufacturingOrderResp, MoDumpModal, SubProductItemMapRequest, SupplierCodeReq, SupplierInfoResponse } from '@xpparel/shared-models';
import { EmbDispatchService } from './emb-dispatch.service';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { EmbDispatchInfoService } from './emb-dispatch-info.service';


@ApiTags('Emb Dispatch')
@Controller('emb-dispatch')
export class EmbDispatchController {
    constructor(
        private service: EmbDispatchService,
        private infoService: EmbDispatchInfoService,
    ) {

    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: EmbDispatchCreateRequest})
    @Post('/createEmbDispatch')
    async createEmbDispatch(@Body() req: any): Promise<GlobalResponseObject> {
        try {
           return await this.service.createEmbDispatch(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: EmbDispatchIdStatusRequest})
    @Post('/deleteEmbDispatch')
    async deleteEmbDispatch(@Body() req: any): Promise<GlobalResponseObject> {
        try {
           return await this.service.deleteEmbDispatch(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * READER
     * @param req 
     * @returns 
     */
    @ApiBody({type: EmbDispatchStatusRequest})
    @Post('/getEmbDispatchRequestsByReqStatus')
    async getEmbDispatchRequestsByReqStatus(@Body() req: any): Promise<EmbDispatchRequestResponse> {
        try {
           return await this.infoService.getEmbDispatchRequestsByReqStatus(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * READER
     * @param req 
     * @returns 
     */
    @ApiBody({type: EmbDispatchIdStatusRequest})
    @Post('/getEmbDispatchRequestForDrId')
    async getEmbDispatchRequestForDrId(@Body() req: any): Promise<EmbDispatchRequestResponse> {
        try {
           return await this.infoService.getEmbDispatchRequestForDrId(req);
        //    return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    /**
     * UPDATER
     * @param req 
     * @returns 
     */
    @ApiBody({type: EmbDispatchIdStatusRequest})
    @Post('/updateEmbDispatchStatus')
    async updateEmbDispatchStatus(@Body() req: any): Promise<GlobalResponseObject> {
        try {
           return await this.service.updateEmbDispatchStatus(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * UPDATER
     * Updates the print status for the dispatch request id
     * @param req 
     * @returns 
     */
    @ApiBody({type: EmbDispatchIdStatusRequest})
    @Post('/updatePrintStatusForDrId')
    async updatePrintStatusForDrId(@Body() req: any): Promise<GlobalResponseObject> {
        try {
           return await this.service.updatePrintStatusForDrId(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * READER
     * Used for getting all the pring information against a gatepass request
     * @param req 
     * @returns 
     */
    @ApiBody({type: EmbDispatchIdStatusRequest})
    @Post('/getDispatchLinesInfoForDisptachRequestId')
    async getDispatchLinesInfoForDisptachRequestId(@Body() req: any): Promise<PoEmbHeaderResponse> {
        try {
           return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
}