import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MoInfoService } from './mo-info.service';
import { returnException } from '@xpparel/backend-utils';
import { RawOrderHeaderInfoResponse, RawOrderInfoResponse, RawOrderNoRequest } from '@xpparel/shared-models';

@ApiTags('Mo Info Module')
@Controller('mo-info')
export class MoInfoController {
    constructor(
        private service: MoInfoService,
    ) {

    }



    @ApiBody({ type: RawOrderNoRequest })
    @Post('/getRawOrderInfo')
    async getRawOrderInfo(@Body() reqObj: RawOrderNoRequest): Promise<RawOrderInfoResponse> {
        try {
            return await this.service.getRawOrderInfo(reqObj);
        } catch (error) {
            return returnException(RawOrderInfoResponse, error)
        }
    }


    @ApiBody({ type: RawOrderNoRequest })
    @Post('/getRawOrderHeaderInfo')
    async getRawOrderHeaderInfo(@Body() reqObj: RawOrderNoRequest): Promise<RawOrderHeaderInfoResponse> {
        try {
            return await this.service.getRawOrderHeaderInfo(reqObj);
        } catch (error) {
            return returnException(RawOrderHeaderInfoResponse, error)
        }
    }
}