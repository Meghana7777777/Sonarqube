import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RejectedReasonsService } from "./rejected-reasons.service";
import { CommonRequestAttrs, CommonResponse, RejectedReasonsActivateReq } from "@xpparel/shared-models";
import { RejectedReasonsDto } from "./dto/rejected-reasons.dto";
import { handleResponse } from "@xpparel/backend-utils";
import { RejectedReasonsToggleDto } from "./dto/rejectedreasons-toggle.dto";

@ApiTags('rejected-reasons')
@Controller('rejected-reasons')
export class RejectedReasonsController {
    constructor(
        private service: RejectedReasonsService
    ) {

    }

    @Post('saveReasons')
    async saveReasons(@Body() req: RejectedReasonsDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.saveReasons(req),
            CommonResponse
        )
    }

    @Post('getRejectedReasons')
    async getRejectedReasons(@Body() req: CommonRequestAttrs): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.getRejectedReasons(req),
            CommonResponse
        )
    }

     @Post('/toggleRejectedReasons')
     async toggleRejectedReasons(@Body() dto:  RejectedReasonsToggleDto): Promise<CommonResponse> {
       return handleResponse(
         async () => this.service.toggleRejectedReasons(dto),
         CommonResponse
       );
     }


    @Post('rejectedReasonsDropDown')
    async rejectedReasonsDropDown(@Body() req: CommonRequestAttrs): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.rejectedReasonsDropDown(req),
            CommonResponse
        )
    }
}