import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CutDispatchCreateRequest, CutDispatchIdStatusRequest, CutDispatchRequestResponse, CutDispatchStatusRequest, CutDispatchVendorTransUpdateRequest, DSetGetBarcodesRequest, DSetBarcodesResponse, DSetSubItemContainerMappingRequest, GlobalResponseObject, LayIdsRequest, DSetItemBarcodesResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { DispatchReadyService } from './dispatch-ready.service';
import { DispatchReadyInfoService } from './dispatch-ready-info.service';




@ApiTags('Dispatch Ready')
@Controller('dispatch-ready')
export class DispatchReadyController {
    constructor(
        private service: DispatchReadyService,
        private infoService: DispatchReadyInfoService,
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
    async putDSetSubItemInTheContainer(@Body() req: DSetSubItemContainerMappingRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.putDSetSubItemInTheContainer(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/removeDSetSubItemInTheContainer')
    async removeDSetSubItemInTheContainer(@Body() req: DSetSubItemContainerMappingRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.removeDSetSubItemInTheContainer(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }

    }

    @ApiBody({ type: DSetGetBarcodesRequest })
    @Post('/getDsetBarcodeInfo')
    async getDsetBarcodeInfo(@Body() req: any): Promise<DSetBarcodesResponse> {
        try {
            return await this.infoService.getDsetBarcodeInfo(req);
        } catch (error) {
            return returnException(DSetBarcodesResponse, error);
        }
    }

    @ApiBody({type: DSetGetBarcodesRequest})
    @Post('/getDsetItemBarcodeInfo')
    async getDsetItemBarcodeInfo(@Body() req: DSetGetBarcodesRequest): Promise<DSetItemBarcodesResponse> {
        try {
            return await this.infoService.getDsetItemBarcodeInfo(req);
        } catch (error) {
            return returnException(DSetItemBarcodesResponse, error);
        }
    }
}