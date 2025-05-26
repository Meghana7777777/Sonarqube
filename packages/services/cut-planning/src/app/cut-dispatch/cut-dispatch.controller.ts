import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CutDispatchCreateRequest, CutDispatchIdStatusRequest, CutDispatchRequestResponse, CutDispatchStatusRequest, CutDispatchVendorTransUpdateRequest, GlobalResponseObject, LayIdsRequest } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { CutDispatchService } from './cut-dispatch.service';
import { CutDispatchInfoService } from './cut-dispatch-info.service';
 

@ApiTags('Cut Dispatch')
@Controller('cut-dispatch')
export class CutDispatchController {
    constructor(
        private service: CutDispatchService,
        private infoService: CutDispatchInfoService,
    ) {

    }


    @ApiBody({type: CutDispatchCreateRequest})
    @Post('/createCutDispatch')
    async createCutDispatch(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // return null;
            return await this.service.createCutDispatch(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({type: CutDispatchIdStatusRequest})
    @Post('/deleteCutDispatch')
    async deleteCutDispatch(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteCutDispatch(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({type: CutDispatchStatusRequest})
    @Post('/getCutDispatchRequestsByStatus')
    async getCutDispatchRequestsByStatus(@Body() req: any): Promise<CutDispatchRequestResponse> {
        try {
            return await this.infoService.getCutDispatchRequestsByStatus(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({type: CutDispatchIdStatusRequest})
    @Post('/getCutDispatchRequestsByCutDrId')
    async getCutDispatchRequestsByCutDrId(@Body() req: any): Promise<CutDispatchRequestResponse> {
        try {
            return await this.infoService.getCutDispatchRequestsByCutDrId(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
    
    @ApiBody({type: CutDispatchIdStatusRequest})
    @Post('/updatePrintStatusForCutDrId')
    async updatePrintStatusForCutDrId(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.updatePrintStatusForCutDrId(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({type: CutDispatchVendorTransUpdateRequest})
    @Post('/updateVendorAndTransportInfoForCutDrId')
    async updateVendorAndTransportInfoForCutDrId(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.updateVendorAndTransportInfoForCutDrId(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({type: CutDispatchIdStatusRequest})
    @Post('/updateCutDispatchRequestStatus')
    async updateCutDispatchRequestStatus(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.updateCutDispatchRequestStatus(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

}