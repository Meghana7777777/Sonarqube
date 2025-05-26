import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { InsTypesRequest, InsTypesRequestById, InsTypesResponse } from "@xpparel/shared-models";
import { InsTypesService } from "./ins-types.service";



@ApiTags('inspection-masters')
@Controller('inspection-masters')
export class InsTypesController {

    constructor(private readonly insTypesService: InsTypesService) {

    }

    @Post('/createInsType')
    async createInsType(@Body() req: InsTypesRequest): Promise<InsTypesResponse> {
        try {
            return await this.insTypesService.createInsType(req);
        } catch (error) {
            return returnException(InsTypesResponse, error)
        }
    }
    

    @Post('/getInsType')
    async getInsTypes(@Body() req: InsTypesRequestById): Promise<InsTypesResponse> {
        try {
            return await this.insTypesService.getInsTypes(req);
        } catch (error) {
            return returnException(InsTypesResponse, error)
        }
    }

    @Post('/deleteInsType')
    async deleteInsType(@Body() req: InsTypesRequestById): Promise<InsTypesResponse> {
        try {
            return await this.insTypesService.deleteInsTypes(req);
        } catch (error) {
            return returnException(InsTypesResponse, error)
        }
    }

}