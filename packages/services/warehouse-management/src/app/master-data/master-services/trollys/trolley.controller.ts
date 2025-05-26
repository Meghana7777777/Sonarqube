import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {CommonRequestAttrs, GlobalResponseObject, TrollyBarcodesRequest, TrollyCreateRequest, TrollyIdsRequest, TrollyResponse} from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { TrolleyService } from './trolley.service';



@ApiTags('Trolley Data Module')
@Controller('trolley')
export class TrolleyController {
  constructor(
    private readonly trolleyDataService: TrolleyService
  ) {

  }

  @Post('/createTrolly')
  async createTrolly(@Body() reqModel: TrollyCreateRequest): Promise<TrollyResponse> {
    try {
      return await this.trolleyDataService.createTrolly(reqModel);
    } catch (error) {
      return returnException(TrollyResponse,error)
    }
  }

  @Post('/updateTrolly')
  async updateTrolly(@Body() reqModel: TrollyCreateRequest): Promise<GlobalResponseObject> {
    try {
      return await this.trolleyDataService.updateTrolly(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject,error)
    }
  }

  @Post('/activateDeactivateTrolly')
  async activateDeactivateTrolly(@Body() reqModel: TrollyIdsRequest): Promise<TrollyResponse> {
    try {
      return await this.trolleyDataService.activateDeactivateTrollys(reqModel);
    } catch (error) {
      return returnException(TrollyResponse,error)
    }
  }

  @ApiBody({ type: CommonRequestAttrs })
  @Post('/getAllTrollys')
  async getAllTrollys(@Body() reqModel:any): Promise<TrollyResponse>{
    try{
        return await this.trolleyDataService.getAllTrollys(reqModel);
    }catch(error){
        return returnException(TrollyResponse, error)
    }
  }

  @ApiBody({ type: TrollyIdsRequest })
  @Post('/getTrollysByTrollyIds')
  async getTrollysByTrollyIds(@Body() reqModel:any): Promise<TrollyResponse>{
    try{
      return await this.trolleyDataService.getTrollysByTrollyIds(reqModel);
    } catch(error){
      return returnException(TrollyResponse, error)
    }
  }

  @ApiBody({ type: TrollyBarcodesRequest })
  @Post('/getTrollysByTrollyBarcodes')
  async getTrollysByTrollyBarcodes(@Body() reqModel:any): Promise<TrollyResponse>{
    try{
      return await this.trolleyDataService.getTrollysByTrollyBarcodes(reqModel);
    } catch(error){
      return returnException(TrollyResponse, error)
    }
  }
}