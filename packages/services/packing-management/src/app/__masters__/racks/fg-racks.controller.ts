import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


import { returnException } from "@xpparel/backend-utils";
import { CommonRequestAttrs, FgGetAllRackResp, FgRackCreateReq, FgRackFilterRequest, FgRacksActivateReq, FgRacksRespons } from "@xpparel/shared-models";
import { FgRacksService } from "./fg-racks.service";



@ApiTags('Racks Data Module')
@Controller('racks')
export class FgRacksController {
  constructor(private readonly racksDataService: FgRacksService) { }
  @Post('createRacks')
  async createRacks(@Body() reqModel: FgRackCreateReq): Promise<FgRacksRespons> {
    try {
      return await this.racksDataService.createRacks(reqModel);
    } catch (error) {
      return returnException(FgRacksRespons, error)
    }
  }
  @Post('activedeactiveRacks')
  async ActivateDeactivateRacks(@Body() reqModel: FgRacksActivateReq): Promise<FgRacksRespons> {
    try {
      return await this.racksDataService.activateDeactivateRacks(reqModel);
    } catch (error) {
      return returnException(FgRacksRespons, error)
    }
  }

  @Post('/getAllRacksData')
  async getAllRacksData(@Body() reqModel: FgRackFilterRequest): Promise<FgRacksRespons> {
    try {
      return await this.racksDataService.getAllRacksData(reqModel);
    } catch (error) {
      return returnException(FgRacksRespons, error)
    }
  }

  @Post('/getAllRacksData')
  async getRacksData(@Body() reqModel: FgRackFilterRequest): Promise<FgRacksRespons> {
    try {
      return await this.racksDataService.getAllRacksData(reqModel);
    } catch (error) {
      return returnException(FgRacksRespons, error)
    }
  }

  @Post('/getAllRacksDataDropdown')
  async getAllRacksDataDropdown(@Body() req: FgRackFilterRequest): Promise<FgGetAllRackResp> {
    try {
      return await this.racksDataService.getAllRacksDataDropdown(req.companyCode, req.unitCode, req.whId, [])
    } catch (error) {
      return returnException(FgGetAllRackResp, error)
    }
  }


}
