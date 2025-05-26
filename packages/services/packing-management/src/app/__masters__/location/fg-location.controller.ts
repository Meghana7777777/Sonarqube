import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { CommonRequestAttrs, FgLocationCreateReq, FgLocationsResponse, FgGetAllLocationByRackIdRes, FgGetLocationByRackIdReq, FgRackAndLocationRes, FgRackIdReq, FgRackIdsAndLevelsReq, FgRackOccupiedReq, FgRackOccupiedRes, FgTotalRackRes, FgLocationFilterReq, CommonResponse, WarehouseIdRequest } from "@xpparel/shared-models";
import { FgLocationsService } from "./fg-location.services";

@ApiTags('Locations')
@Controller('locations')
export class FgLocationsController {
  constructor(private readonly locationService: FgLocationsService) {

  }

  @Post('createLocations')
  async createLocations(@Body() reqModel: FgLocationCreateReq): Promise<FgLocationsResponse> {
    try {
      return await this.locationService.createLocations(reqModel);
    } catch (error) {
      return returnException(FgLocationsResponse, error)
    }
  }

  @Post('ActivateDeactivateLocations')
  async ActivateDeactivateLocations(@Body() reqModel: FgLocationCreateReq): Promise<FgLocationsResponse> {
    try {
      return await this.locationService.ActivateDeactivateLocations(reqModel);
    } catch (error) {
      return returnException(FgLocationsResponse, error)
    }
  }

  @Post('/getAllLocationData')
  async getAllLocationData(@Body() reqModel: FgLocationFilterReq): Promise<FgLocationsResponse> {
    try {
      return await this.locationService.getAllLocationData(reqModel);
    } catch (error) {
      return returnException(FgLocationsResponse, error)
    }
  }

  @Post('/getMappedRackLevelColumn')
  async getMappedRackLevelColumn(@Body() reqModel: FgRackOccupiedReq): Promise<FgRackOccupiedRes> {
    try {
      return await this.locationService.getMappedRackLevelColumn(reqModel);
    } catch (error) {
      return returnException(FgRackOccupiedRes, error)
    }
  }

  @Post('/getLocationsInRack')
  async getLocationsInRack(@Body() reqModel: FgRackIdReq): Promise<FgRackAndLocationRes> {
    try {
      return await this.locationService.getLocationsInRack(reqModel);
    } catch (error) {
      return returnException(FgRackAndLocationRes, error)
    }
  }


  @Post('/getAllLocationsDataByRackId')
  async getAllLocationsDataByRackId(@Body() req: FgGetLocationByRackIdReq): Promise<FgGetAllLocationByRackIdRes> {
    try {
      return await this.locationService.getAllLocationsDataByRackId(req);
    } catch (error) {
      return returnException(FgGetAllLocationByRackIdRes, error);
    }
  }
 

  @Post('/getSpecificLevelLocationsOfAllRacks')
  async getSpecificLevelLocationsOfAllRacks(@Body() req: FgRackIdsAndLevelsReq): Promise<FgTotalRackRes> {
    try {
      return await this.locationService.getSpecificLevelLocationsOfAllRacks(req);
    } catch (error) {
      return returnException(FgTotalRackRes, error);
    }
  }
}
