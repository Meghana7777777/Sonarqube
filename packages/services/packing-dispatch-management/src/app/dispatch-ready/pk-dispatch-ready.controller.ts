import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CutDispatchCreateRequest, CutDispatchIdStatusRequest, CutDispatchRequestResponse, CutDispatchStatusRequest, CutDispatchVendorTransUpdateRequest, PkDSetGetBarcodesRequest, PkDSetBarcodesResponse, PkDSetSubItemContainerMappingRequest, GlobalResponseObject, LayIdsRequest, PkDSetItemBarcodesResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { PkDispatchReadyService } from './pk-dispatch-ready.service';
import { PkDispatchReadyInfoService } from './pk-dispatch-ready-info.service';




@ApiTags('Dispatch Ready')
@Controller('dispatch-ready')
export class PkDispatchReadyController {
    constructor(
        private service: PkDispatchReadyService,
        private infoService: PkDispatchReadyInfoService,
    ) {

    }

    @ApiBody({ type: CutDispatchCreateRequest })
    @Post('/createCutDispatch')
    async createCutDispatch(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/putDSetSubItemInTheContainer')
    async putDSetSubItemInTheContainer(@Body() req: PkDSetSubItemContainerMappingRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.putDSetSubItemInTheContainer(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/removeDSetSubItemInTheContainer')
    async removeDSetSubItemInTheContainer(@Body() req: PkDSetSubItemContainerMappingRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.removeDSetSubItemInTheContainer(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: PkDSetGetBarcodesRequest })
    @Post('/getDsetBarcodeInfo')
    async getDsetBarcodeInfo(@Body() req: any): Promise<PkDSetBarcodesResponse> {
        try {
            return await this.infoService.getDsetBarcodeInfo(req);
        } catch (error) {
            return returnException(PkDSetBarcodesResponse, error);
        }
    }

    @ApiBody({type: PkDSetGetBarcodesRequest})
    @Post('/getDsetItemBarcodeInfo')
    async getDsetItemBarcodeInfo(@Body() req: PkDSetGetBarcodesRequest): Promise<PkDSetItemBarcodesResponse> {
        try {
            return await this.infoService.getDsetItemBarcodeInfo(req);
        } catch (error) {
            return returnException(PkDSetItemBarcodesResponse, error);
        }
    }
}