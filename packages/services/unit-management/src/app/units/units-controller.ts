import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { UnitsCreateRequest, UnitsIdRequest, UnitsResponse } from "@xpparel/shared-models";
import { UnitsDto } from "./DTO/units-dto";
import { UnitsService } from "./units-service";

@ApiTags('units')
@Controller('units')
export class UnitsController {
    constructor(
        private service: UnitsService, 
    ) { 

    }

    @Post('createUnits')
    @ApiBody({ type: UnitsCreateRequest })
    async createUnits(@Body() req: any): Promise<UnitsResponse> {
        try {
            return await this.service.createUnits(req);
        } catch (error) {
            return returnException(UnitsResponse, error)
        }
    }

    @Post('deleteUnits')
    @ApiBody({ type: UnitsDto })
    async deleteUnits(@Body() req: UnitsIdRequest): Promise<UnitsResponse> {
        try {
            return await this.service.deleteUnits(req);
        } catch (error) {
            return returnException(UnitsResponse, error)
        }
    }

    @Post('getUnits')
    @ApiBody({ type: UnitsDto })
    async getUnits(@Body() req: UnitsIdRequest): Promise<UnitsResponse> {
        try {
            return await this.service.getUnits(req);
        } catch (error) {
            return returnException(UnitsResponse, error);
        }
    }

    // @Post('updateUnits')
    // @ApiBody({ type: UnitsDto })
    // async updateUnits(@Body() req: UnitsDto): Promise<UnitsResponse> {    
    //     try {
    //         return await this.service.updateUnits(req);
    //     } catch (error) {
    //         return returnException(UnitsResponse, error);
    //     }
    // }

    @Post('activeDeactiveUnits')
    @ApiBody({ type: UnitsIdRequest })
    async activeDeactiveUnits(@Body() req: UnitsIdRequest): Promise<UnitsResponse> {
        try {
            return await this.service.activeDeactiveUnits(req);
        } catch (error) {
            return returnException(UnitsResponse, error);
        }
    }

}