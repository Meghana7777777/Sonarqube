import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InsBuyerCodeRequest, InsFabInsConfigRequest, InsFabInsConfigResponse, InsFgInsConfigRequest, InsFgInsConfigResponse, InsSupplierCodeRequest, InsThreadInsConfigRequest, InsThreadInsConfigResponse, InsTrimInsConfigRequest, InsTrimInsConfigResponse, InsYarnInsConfigRequest, InsYarnInsConfigResponse } from "@xpparel/shared-models";
import { InspectionConfigService } from "./inspection-config.service";
import { returnException } from "@xpparel/backend-utils";


@ApiTags('Inspection Config')
@Controller('inspection-config')
export class InspectionConfigController {
    constructor(private readonly inspectionConfigService: InspectionConfigService) {}


    @Post('saveFabInsConfig')
    async saveFabInsConfig(@Body() req: InsFabInsConfigRequest): Promise<InsFabInsConfigResponse> {
        try {
            return await this.inspectionConfigService.saveFabInsConfig(req);
        } catch (error) {
            return returnException(InsFabInsConfigResponse, error);
        }
    }


    @Post('getFabInsConfig')
    async getFabInsConfig(@Body() req: InsSupplierCodeRequest): Promise<InsFabInsConfigResponse> {
        try {
            return await this.inspectionConfigService.getFabInsConfig(req);
        } catch (error) {
            return returnException(InsFabInsConfigResponse, error);
        }
    }
    @Post('saveFgInsConfig')
    async saveFgInsConfig(@Body() req: InsFgInsConfigRequest): Promise<InsFgInsConfigResponse> {
        try {
            return await this.inspectionConfigService.saveFgInsConfig(req);
        } catch (error) {
            return returnException(InsFgInsConfigResponse, error);
        }
    }

    @Post('getFgInsConfig')
    async getFgInsConfig(@Body() req: InsBuyerCodeRequest): Promise<InsFgInsConfigResponse> {
        try {
            return await this.inspectionConfigService.getFgInsConfig(req);
        } catch (error) {
            return returnException(InsFgInsConfigResponse, error);
        }
    } 


    @Post('getFgInsConfigPLLevel')
    async getFgInsConfigPLLevel(@Body() req: InsBuyerCodeRequest): Promise<InsFgInsConfigResponse> {
        try {
            return await this.inspectionConfigService.getFgInsConfigPLLevel(req);
        } catch (error) {
            return returnException(InsFgInsConfigResponse, error);
        }
    } 

    @Post('saveFgInsConfigPLLevel')
    async saveFgInsConfigPLLevel(@Body() req: InsFgInsConfigRequest): Promise<InsFabInsConfigResponse> {
        try {
            return await this.inspectionConfigService.saveFgInsConfigPLLevel(req);
        } catch (error) {
            return returnException(InsFabInsConfigResponse, error);
        }
    }






    @Post('saveThreadInsConfig')
    async saveThreadInsConfig(@Body() req: InsThreadInsConfigRequest): Promise<InsThreadInsConfigResponse> {
        try {
            return await this.inspectionConfigService.saveThreadInsConfig(req);
        } catch (error) {
            return returnException(InsThreadInsConfigResponse, error);
        }
    }

    @Post('getThreadInsConfig')
    async getThreadInsConfig(@Body() req: InsSupplierCodeRequest): Promise<InsThreadInsConfigResponse> {
        try {
            return await this.inspectionConfigService.getThreadInsConfig(req);
        } catch (error) {
            return returnException(InsThreadInsConfigResponse, error);
        }
    }


    @Post('saveTrimInsConfig')
    async saveTrimInsConfig(@Body() req: InsTrimInsConfigRequest): Promise<InsTrimInsConfigResponse> {
        try {
            return await this.inspectionConfigService.saveTrimInsConfig(req);
        } catch (error) {
            return returnException(InsTrimInsConfigResponse, error);
        }
    }

    @Post('getTrimInsConfig')
    async getTrimInsConfig(@Body() req: InsSupplierCodeRequest): Promise<InsTrimInsConfigResponse> {
        try {
            return await this.inspectionConfigService.getTrimInsConfig(req);
        } catch (error) {
            return returnException(InsTrimInsConfigResponse, error);
        }
    }

    
    @Post('saveYarnInsConfig')
    async saveYarnInsConfig(@Body() req: InsYarnInsConfigRequest): Promise<InsYarnInsConfigResponse> {
        try {
            return await this.inspectionConfigService.saveYarnInsConfig(req);
        } catch (error) {
            return returnException(InsYarnInsConfigResponse, error);
        }
    }

    @Post('getYarnInsConfig')
    async getYarnInsConfig(@Body() req: InsSupplierCodeRequest): Promise<InsYarnInsConfigResponse> {
        try {
            return await this.inspectionConfigService.getYarnInsConfig(req);
        } catch (error) {
            return returnException(InsYarnInsConfigResponse, error);
        }
    }



}
