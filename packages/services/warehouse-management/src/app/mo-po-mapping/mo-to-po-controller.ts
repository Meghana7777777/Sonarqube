import { Body, Controller, Post } from '@nestjs/common';
import { returnException } from '@xpparel/backend-utils';
import { CommonIdReqModal, CommonResponse, ManufacturingOrderNumberRequest, MOToPOMappingReq } from '@xpparel/shared-models';
import { MoToPoMapService } from './mo-to-po.service';

@Controller('mo-to-rm-po-map')
export class MoToPoMapController {
  constructor(private readonly moToPoMapService: MoToPoMapService) { }

  @Post('mapMoToRMPo')
  async mapMoToRMPo(@Body() mapping: MOToPOMappingReq): Promise<CommonResponse> {
    try {
      return await this.moToPoMapService.mapMoToRMPo(mapping);
    } catch (error) {
      return returnException(CommonResponse, error)
    }
  }

  @Post('getMoToRmPoMapData')
  async getMoToRmPoMapData(@Body() mapping: ManufacturingOrderNumberRequest): Promise<CommonResponse> {
    try {
      return await this.moToPoMapService.getMoToRmPoMapData(mapping);
    } catch (error) {
      return returnException(CommonResponse, error)
    }
  }
  @Post('deleteMapping')
  async deleteMapping(@Body() req: CommonIdReqModal): Promise<CommonResponse> {
    try {
      return await this.moToPoMapService.deleteMapping(req);
    } catch (error) {
      return returnException(CommonResponse, error)
    }
  }
}