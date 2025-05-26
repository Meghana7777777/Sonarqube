import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BinsActivateRequest, BinsCreateRequest, BinsResponse, CommonRequestAttrs, RackOccupiedRequest, RackOccupiedResponse, GetAllBinsByRackIdRes, GetBinsByRackIdReq, RackAndBInResponse, RackIdRequest, RackIdsAndLevelsRequest, TotalRackResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { BinsDataService } from './bins.services';



@ApiTags('Bins Data Module')
@Controller('bins')
export class BinsDataController {
  constructor(private readonly binDataService: BinsDataService) { 
    
  }

  @Post('createBins')
  async createBins(@Body() reqModel: BinsCreateRequest): Promise<BinsResponse> {
    try {
      return await this.binDataService.createBins(reqModel);
    } catch (error) {
      return returnException(BinsResponse, error)
    }
  }

  @Post('ActivateDeactivateBins')
  async ActivateDeactivateBins(@Body() reqModel: BinsActivateRequest): Promise<BinsResponse> {
    try {
      return await this.binDataService.ActivateDeactivateBins(reqModel);
    } catch (error) {
      return returnException(BinsResponse, error)
    }
  }

  @Post('/getAllBinData')
  async getAllBinData(@Body() reqModel: CommonRequestAttrs): Promise<BinsResponse> {
    try {
      return await this.binDataService.getAllBinData(reqModel);
    } catch (error) {
      return returnException(BinsResponse, error)
    }
  }

  @Post('/getMappedRackLevelColumn')
  async getMappedRackLevelColumn(@Body() reqModel:RackOccupiedRequest): Promise<RackOccupiedResponse>{
    try{
        return await this.binDataService.getMappedRackLevelColumn(reqModel);
    }catch(error){
        return returnException(RackOccupiedResponse, error)
    }
  }

  @Post('/getBinsInRack')
  async getBinsInRack(@Body() reqModel:RackIdRequest): Promise<RackAndBInResponse>{
    try{
        return await this.binDataService.getBinsInRack(reqModel);
    }catch(error){
        return returnException(RackAndBInResponse, error)
    }
  }


  @Post('/getAllBinsDataByRackId')
  async getAllBinsDataByRackId(@Body() req: GetBinsByRackIdReq): Promise<GetAllBinsByRackIdRes> {
    try {
      return await this.binDataService.getAllBinsDataByRackId(req);
    } catch (error) {
      return returnException(GetAllBinsByRackIdRes, error);
    }
  }

  @Post('/getSpecificLevelBinsOfAllRacks')
  async getSpecificLevelBinsOfAllRacks(@Body() req: RackIdsAndLevelsRequest): Promise<TotalRackResponse> {
    try {
      return await this.binDataService.getSpecificLevelBinsOfAllRacks(req);
    } catch (error) {
      return returnException(TotalRackResponse, error);
    }
  }
}
