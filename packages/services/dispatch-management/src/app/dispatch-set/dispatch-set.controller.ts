import { Body, Controller, Inject, Post, forwardRef } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CutDispatchCreateRequest, DSetCreateRequest, DSetFilterRequest, DSetIdsRequest, DSetItemIdsRequest, DSetResponse, GlobalResponseObject, ShippingRequestFilterRequest } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { DispatchSetInfoService } from './dispatch-set-info.service';
import { DispatchSetService } from './dispatch-set.service';


@ApiTags('Dispatch Set')
@Controller('dispatch-set')
export class DispatchSetController {
    constructor(
        @Inject(forwardRef(() => DispatchSetService)) private service: DispatchSetService,
        @Inject(forwardRef(() => DispatchSetInfoService)) private infoService: DispatchSetInfoService,
    ) {

    }

    // TESTED
    @Post('/createDispatchSet')
    async createDispatchSet(@Body() req: DSetCreateRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.createDispatchSet(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    // TESTED
    @Post('/deleteDispatchSet')
    async deleteDispatchSet(@Body() req: DSetIdsRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteDispatchSet(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getDispatchSetByIds')
    async getDispatchSetByIds(@Body() req: DSetIdsRequest): Promise<DSetResponse> {
        try {
            return await this.infoService.getDispatchSetByIds(req);
        } catch (error) {
            return returnException(DSetResponse, error);
        }
    }

    @Post('/getDispatchSetByFilter')
    async getDispatchSetByFilter(@Body() req: DSetFilterRequest): Promise<DSetResponse> {
        try {
            return await this.infoService.getDispatchSetByFilter(req);
        } catch (error) {
            return returnException(DSetResponse, error);
        }
    }

    @Post('/approveDispatchSet')
    async approveDispatchSet(@Body() req: DSetIdsRequest): Promise<GlobalResponseObject> {
        try {
            return null
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('/rejectDispatchSet')
    async rejectDispatchSet(@Body() req: DSetIdsRequest): Promise<GlobalResponseObject> {
        try {
            return null
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('/updateSubItemPrintStatus')
    async updateSubItemPrintStatus(@Body() req: DSetItemIdsRequest): Promise<GlobalResponseObject> {
        try {
            return this.service.updateSubItemPrintStatus(req)
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('/updateContainerPrintStatus')
    async updateContainerPrintStatus(@Body() req: DSetItemIdsRequest): Promise<GlobalResponseObject> {
        try {
            return this.service.updateContainerPrintStatus(req)
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('/releaseSubItemPrintStatus')
    async releaseSubItemPrintStatus(@Body() req: DSetItemIdsRequest): Promise<GlobalResponseObject> {
        try {
            return this.service.releaseSubItemPrintStatus(req)
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('/releaseContainerPrintStatus')
    async releaseContainerPrintStatus(@Body() req: DSetItemIdsRequest): Promise<GlobalResponseObject> {
        try {
            return this.service.releaseContainerPrintStatus(req)
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }
}