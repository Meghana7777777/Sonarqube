import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, GetAllRacksResp, RacksActivateRequest, RacksCreateRequest, RacksResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { RacksDataService } from './racks.service';



@ApiTags('Racks Data Module')
@Controller('racks')
export class RacksDataController {
  constructor(private readonly racksDataService: RacksDataService) { }
  @Post('createRacks')
  async createRacks(@Body() reqModel: RacksCreateRequest): Promise<RacksResponse> {
    try {
      return await this.racksDataService.createRacks(reqModel);
    } catch (error) {
      return returnException(RacksResponse, error)
    }
  }
  @Post('activedeactiveRacks')
  async ActivateDeactivateRacks(@Body() reqModel: RacksActivateRequest): Promise<RacksResponse> {
    try {
      return await this.racksDataService.activateDeactivateRacks(reqModel);
    } catch (error) {
      return returnException(RacksResponse, error)
    }
  }

  @Post('/getAllRacksData')
  async getAllRacksData(@Body() reqModel: CommonRequestAttrs): Promise<RacksResponse> {
    console.log(reqModel, '12345');
    try {
      return await this.racksDataService.getAllRacksData(reqModel);
    } catch (error) {
      return returnException(RacksResponse, error)
    }
  }

  @Post('/getAllRacksDataa')
  async getAllRacksDataa(): Promise<GetAllRacksResp> {
    try {
      return await this.racksDataService.getAllRacksDataa()
    } catch (error) {
      return returnException(GetAllRacksResp, error)
    }
  }


}
