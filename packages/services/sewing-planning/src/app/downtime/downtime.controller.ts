import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { DowntimeService } from './downtime.service';
import { DowntimeRequest, DowntimeResponseModel, DowntimeUpdateRequest, GlobalResponseObject } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';

ApiTags('WorkStation Downtime')
@Controller('downtime')
export class DowntimeController {
    constructor(private readonly downtimeService: DowntimeService) {

    }



    @Post('createDownTime')
    @ApiBody({ type: DowntimeRequest })
    async createDownTime(@Body() requestModel: DowntimeRequest): Promise<GlobalResponseObject> {
        try {
            return this.downtimeService.createDownTime(requestModel);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

// todo:DateRangeRequest
    @Post('getDownTimeByDateRange')
    @ApiBody({ })
    async getDownTimeByDateRange(@Body() requestModel: any): Promise<DowntimeResponseModel> {
        try {
            return this.downtimeService.getDownTimeByDateRange(requestModel);
        } catch (error) {
            return returnException(DowntimeResponseModel, error);
        }
    }


    @Post('updateDownTime')
    @ApiBody({type:DowntimeUpdateRequest})
    async updateDowntime(@Body() requestModel: DowntimeUpdateRequest): Promise<GlobalResponseObject> {
        try {
            return this.downtimeService.updateDownTime(requestModel);
        } catch (error) {
            return error
        }
      
    }

}




