import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {CommonRequestAttrs, RollAttributesActivateRequest, RollAttributesCreateRequest, RollAttributesResponse} from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { RollAttributesDataService } from './roll-attributes.service';



@ApiTags('Roll Attributes Data Module')
@Controller('rollattributes')
export class RollAttributesDataController {
  constructor(private readonly rollAttributesDataService: RollAttributesDataService) {}

  @Post('/createRollAttributes')
  async createRollAttributes(@Body() reqModel: RollAttributesCreateRequest): Promise<RollAttributesResponse> {
    try {
      return await this.rollAttributesDataService.createRollAttributes(reqModel);
    } catch (error) {
      return returnException(RollAttributesResponse,error)
    }
  }
  @Post('/ActivateDeactivateRollAttributes')
  async ActivateDeactivateRollAttributes(@Body() reqModel: RollAttributesActivateRequest): Promise<RollAttributesResponse> {
    try {
      return await this.rollAttributesDataService.ActivateDeactivateRollAttributes(reqModel);
    } catch (error) {
      return returnException(RollAttributesResponse,error)
    }
  }

  @Post('/getAllRRollAttributesData')
  async getAllRRollAttributesData(@Body() reqModel:CommonRequestAttrs): Promise<RollAttributesResponse>{
      try{
          return await this.rollAttributesDataService.getAllRRollAttributesData(reqModel);
      }catch(error){
          return returnException(RollAttributesResponse, error)
      }
  }

 
  
}
