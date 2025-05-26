import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { InsMasterReasonsCreateRequest, InsReasonsActivateRequest, InsReasonsCategoryRequest, InsReasonsResponse } from '@xpparel/shared-models';
import { ReasonsDataService } from './ins-reasons.service';



@ApiTags('ins-reasons')
@Controller('ins-reasons')
export class ReasonsDataController {
  constructor(private readonly masterDataService: ReasonsDataService) {}

  @Post('/insCreateReasons')
  async insCreateReasons(@Body() reqModel: InsMasterReasonsCreateRequest): Promise<InsReasonsResponse> {
    try {
      return await this.masterDataService.insCreateReasons(reqModel);
    } catch (error) {
      return returnException(InsReasonsResponse,error)
    }
  }
  @Post('/insActivateDeactivateReasons')
  async insActivateDeactivateReasons(@Body() reqModel: InsReasonsActivateRequest): Promise<InsReasonsResponse> {
    try {
      return await this.masterDataService.insActivateDeactivateReasons(reqModel);
    } catch (error) {
      return returnException(InsReasonsResponse,error)
    }
  }

  @Post('/insGetAllReasonsData')
  async insGetAllReasonsData(@Body() reqModel:InsReasonsCategoryRequest): Promise<InsReasonsResponse>{
      try{
          return await this.masterDataService.insGetAllReasonsData(reqModel);
      }catch(error){
          return returnException(InsReasonsResponse, error)
      }
  }

  @Post('/insGetReasonsAgainstCategory')
  async insGetReasonsAgainstCategory(@Body() reqModel: InsReasonsCategoryRequest): Promise<InsReasonsResponse> {
    try {
      return await this.masterDataService.insGetReasonsAgainstCategory(reqModel);
    } catch (error) {
      
      return returnException(InsReasonsResponse,error);
    }
  }
}
  

