import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
// import { DowntimeService } from './bundling.service';
import { DowntimeRequest, DowntimeResponseModel, DowntimeUpdateRequest, GlobalResponseObject } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';

ApiTags('Sewing Bundling')
@Controller('bundling')
export class BundlingController {
    constructor(
        // private readonly downtimeService: DowntimeService
    ) {

    }


    // @Post('createDownTime')
    // @ApiBody({ type: DowntimeRequest })
    // async createDownTime(@Body() requestModel: DowntimeRequest): Promise<GlobalResponseObject> {
    //     try {
    //         return this.downtimeService.createDownTime(requestModel);
    //     } catch (error) {
    //         return returnException(GlobalResponseObject, error)
    //     }
    // }

}
