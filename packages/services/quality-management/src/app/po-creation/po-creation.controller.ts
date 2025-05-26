import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { CommonResponse, PoNumberRequest } from "@xpparel/shared-models";
import { PoCreationDto } from "./dto/po-creation-dto";
import { PoCreationService } from "./po-creation.service";


@ApiTags('/po-creation')
@Controller('po-creation')
export class PoCreationController {
    constructor(
        private service: PoCreationService,
    ) { }

    @Post('/createPo')
    @ApiBody({ type: PoCreationDto })
    async createPo(@Body() req: any, isUpdate: boolean): Promise<CommonResponse> {
        try {
            return await this.service.createPo(req, false);
        } catch (error) {
            return returnException(CommonResponse, error)
        }
    }

    @Post('/getPoViewInfo')
    @ApiBody({ type: PoNumberRequest })
    async getPoViewInfo(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.service.getPoViewInfo(req);
        } catch (error) {
            return returnException(CommonResponse, error)
        }
    }

}