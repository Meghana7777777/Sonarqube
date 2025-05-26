import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FgRackDashboardService } from "./rack-dashboard.service";
import { returnException } from "@xpparel/backend-utils";
import { CommonRequestAttrs } from "packages/libs/shared-models/src/common";
import { FgRackIdReq, FgTotalRackRes, LocationContainerCartonInfoResponse } from "@xpparel/shared-models";

@ApiTags('Dashboard')
@Controller('dashboard')
export class FgRackDashboardController {
    constructor(
        private readonly rackDashboardService: FgRackDashboardService
    ) { }


    @Post('/getRackAndLocationTotalData')
    async getRackAndLocationTotalData(@Body() reqModel: CommonRequestAttrs): Promise<FgTotalRackRes> {
        try {
            return await this.rackDashboardService.getRackAndLocationTotalData(reqModel);
        } catch (error) {
            return returnException(FgTotalRackRes, error);
        }
    }

    @Post('/getRackAndLocationData')
    async getRackAndLocationData(@Body() reqModel: FgRackIdReq): Promise<FgTotalRackRes> {
        try {
            return await this.rackDashboardService.getRackAndLocationData(reqModel);
        } catch (error) {
            return returnException(FgTotalRackRes, error);
        }
    }
    @Post('/getLocationsForRackLevelAndColumn')
    async getLocationsForRackLevelAndColumn(@Body() reqModel: FgRackIdReq): Promise<FgTotalRackRes> {
        try {
            return await this.rackDashboardService.getLocationsForRackLevelAndColumn(reqModel);
        } catch (error) {
            return returnException(FgTotalRackRes, error);
        }
    }

    @Post('/getLocationInfoByRack') 
    async getLocationInfoByRack(@Body() reqModel: FgRackIdReq): Promise<LocationContainerCartonInfoResponse> {
        try {
            return await this.rackDashboardService.getLocationInfoByRack(reqModel.rackId, reqModel.unitCode, reqModel.companyCode, reqModel.username, reqModel.userId);
        } catch (error) {
            return returnException(LocationContainerCartonInfoResponse,error);
        }
    }
}