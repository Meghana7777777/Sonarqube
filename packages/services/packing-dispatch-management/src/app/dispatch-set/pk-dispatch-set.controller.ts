import { Body, Controller, Inject, Post, forwardRef } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { CreateDispatchSetRequest, DSetReqIdDto, GlobalResponseObject, PackListIdRequest, PkDSetFilterRequest, PkDSetIdsRequest, PkDSetItemIdsRequest, PkDSetResponse, PkDSetSubItemRefResponse } from '@xpparel/shared-models';
import { PkDispatchSetInfoService } from './pk-dispatch-set-info.service';
import { PkDispatchSetService } from './pk-dispatch-set.service';


@ApiTags('Dispatch Set')
@Controller('dispatch-set')
export class PkDispatchSetController {
    constructor(
        @Inject(forwardRef(() => PkDispatchSetService)) private service: PkDispatchSetService,
        @Inject(forwardRef(() => PkDispatchSetInfoService)) private infoService: PkDispatchSetInfoService,
    ) {

    }

    // TESTED
    @Post('/createDispatchSet')
    async createDispatchSet(@Body() req: CreateDispatchSetRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.createDispatchSet(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    // TESTED
    @Post('/deleteDispatchSet')
    async deleteDispatchSet(@Body() req: PkDSetIdsRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteDispatchSet(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getDispatchSetByIds')
    async getDispatchSetByIds(@Body() req: PkDSetIdsRequest): Promise<PkDSetResponse> {
        try {
            return await this.infoService.getDispatchSetByIds(req);
        } catch (error) {
            return returnException(PkDSetResponse, error);
        }
    }

    @Post('/getDispatchSetByFilter')
    async getDispatchSetByFilter(@Body() req: PkDSetFilterRequest): Promise<PkDSetResponse> {
        try {
            return await this.infoService.getDispatchSetByFilter(req);
        } catch (error) {
            return returnException(PkDSetResponse, error);
        }
    }

    @Post('/approveDispatchSet')
    async approveDispatchSet(@Body() req: PkDSetIdsRequest): Promise<GlobalResponseObject> {
        try {
            return null
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('/rejectDispatchSet')
    async rejectDispatchSet(@Body() req: PkDSetIdsRequest): Promise<GlobalResponseObject> {
        try {
            return null
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('/updateSubItemPrintStatus')
    async updateSubItemPrintStatus(@Body() req: PkDSetItemIdsRequest): Promise<GlobalResponseObject> {
        try {
            return this.service.updateSubItemPrintStatus(req)
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('/updateContainerPrintStatus')
    async updateContainerPrintStatus(@Body() req: PkDSetItemIdsRequest): Promise<GlobalResponseObject> {
        try {
            return this.service.updateContainerPrintStatus(req)
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('/releaseSubItemPrintStatus')
    async releaseSubItemPrintStatus(@Body() req: PkDSetItemIdsRequest): Promise<GlobalResponseObject> {
        try {
            return this.service.releaseSubItemPrintStatus(req)
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('/releaseContainerPrintStatus')
    async releaseContainerPrintStatus(@Body() req: PkDSetItemIdsRequest): Promise<GlobalResponseObject> {
        try {
            return this.service.releaseContainerPrintStatus(req)
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('/getSubItemsListForDSetRefId')
    async getSubItemsListForDSetRefId(@Body() req: PackListIdRequest): Promise<PkDSetSubItemRefResponse> {
        try {
            return this.infoService.getSubItemsListForDSetRefId(req)
        } catch (error) {
            return returnException(PkDSetSubItemRefResponse, error)
        }
    }

    @Post('updateFgOutReqForDispatch')
    async updateFgOutReqForDispatch(@Body() req: DSetReqIdDto): Promise<GlobalResponseObject> {
        try {
            return this.infoService.updateFgOutReqForDispatch(req)
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }
}