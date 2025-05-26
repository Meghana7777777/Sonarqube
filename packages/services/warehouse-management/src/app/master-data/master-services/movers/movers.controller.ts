import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, MoversActivateRequest, MoversCreateRequest, MoversResponse} from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { MoversDataService } from './movers.service';



@ApiTags('Movers Data Module')
@Controller('movers')
export class MoversDataController {
  constructor(private readonly moversDataService: MoversDataService) {}
  
  @Post('/createMovers')
  async createMovers(@Body() reqModel: MoversCreateRequest): Promise<MoversResponse> {
    try {
      return await this.moversDataService.createMovers(reqModel);
    } catch (error) {
      return returnException(MoversResponse,error)
    }
  }
  @Post('/ActivateDeactivateMovers')
  async ActivateDeactivateMovers(@Body() reqModel: MoversActivateRequest): Promise<MoversResponse> {
    try {
      return await this.moversDataService.ActivateDeactivateMovers(reqModel);
    } catch (error) {
      return returnException(MoversResponse,error)
    }
  }

  @Post('/getAllMoversData')
  async getAllMoversData(@Body() reqModel:CommonRequestAttrs): Promise<MoversResponse>{
      try{
          return await this.moversDataService.getAllMoversData(reqModel);
      }catch(error){
          return returnException(MoversResponse, error)
      }
  }


  
}
