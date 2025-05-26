import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { CommonRequestAttrs, CutTableIdRequest, DateUnitCompanyRequest, FabricInwardDetailsResponse, GlobalResponseObject, GrnRollInfoResponse, MRStatusRequest, ManufacturingOrderNumberRequest, MaterialRequestNoRequest, PackingListInfoModel, PackingListInfoResponse, PackingListSummaryRequest, PackingListSummaryResponse, PhBatchLotRollRequest, StockCodesRequest, StockObjectInfoResponse, SupplierCodeReq, SupplierPoSummaryResponse, SupplierWisePackListsCountReqIdDto, SupplierWisePackListsCountResponse, SuppliersResponse, TodayArrivalSummaryResponse, WhExtReqNoRequest, WhFabMaterialRequestInfoResponse, WhMaterialRequestsResponse, WhReqCreateHeaderModel } from '@xpparel/shared-models';
import { RollIdRequest } from 'packages/libs/shared-models/src/wms/location-allocation/roll-id.request';
import { FabricRequestCreationInfoService } from './fabric-request-creation-info.service';
import { FabricRequestCreationService } from './fabric-request-creation.service';

@ApiTags('Material Handling')
@Controller('fabric-request')
export class FabricRequestCreationController {
  constructor(
    private readonly service: FabricRequestCreationService,
    private readonly infoService: FabricRequestCreationInfoService
  ) { }

  /**
   * WRITER
   * ENDPOINT
   * This will be trigger as a user action from the CTD WH
   * This will create the fabric WH request
   * @param req 
   */
  @ApiBody({ type: MaterialRequestNoRequest })
  @Post('/createFabricWhRequestByExtReqNo')
  async createFabricWhRequestByExtReqNo(@Body() reqObj: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.createFabricWhRequestByExtReqNo(reqObj);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  // @ApiBody({ type: WhReqCreateHeaderModel})
  // @Post('/createFabricWhRequest')
  // async createFabricWhRequest(@Body() reqObj: any): Promise<GlobalResponseObject> {
  //   try {
  //      return await this.service.createFabricWhRequest(reqObj);
  //   } catch (err) {
  //     return returnException(GlobalResponseObject, err);
  //   }
  // }

  @ApiBody({ type: WhExtReqNoRequest })
  @Post('/deleteFabricWhRequest')
  async deleteFabricWhRequest(@Body() reqObj: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.deleteFabricWhRequest(reqObj);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  /**
   * USED by WH dashboard
   * READER
   * @param req 
   * @returns 
   */
  @ApiBody({ type: CutTableIdRequest })
  @Post('/getPendingWhFabricRequestsForCutTableId')
  async getPendingWhFabricRequestsForCutTableId(@Body() req: any): Promise<WhMaterialRequestsResponse> {
    try {
      return await this.infoService.getPendingWhFabricRequestsForCutTableId(req);
    } catch (err) {
      return returnException(WhMaterialRequestsResponse, err);
    }
  }

  @ApiBody({ type: MRStatusRequest })
  @Post('/getWhMaterialRequests')
  async getWhMaterialRequests(@Body() req: any): Promise<WhMaterialRequestsResponse> {
    try {
      return await this.infoService.getWhMaterialRequests(req);
    } catch (err) {
      return returnException(WhMaterialRequestsResponse, err);
    }
  }

  /**
   * USED by WH dashboard
   * READER
   * @param req 
   * @returns 
   */
  @ApiBody({ type: MaterialRequestNoRequest })
  @Post('/getItemInfoForWhFabRequestNo')
  async getItemInfoForWhFabRequestNo(@Body() req: any): Promise<WhFabMaterialRequestInfoResponse> {
    try {
      return await this.infoService.getItemInfoForWhFabRequestNo(req);
    } catch (err) {
      return returnException(WhFabMaterialRequestInfoResponse, err);
    }
  }

  @ApiBody({ type: ManufacturingOrderNumberRequest })
  @Post('/checkMRExistForGivenMoNo')
  async checkMRExistForGivenMoNo(@Body() req: ManufacturingOrderNumberRequest): Promise<CommonResponse> {
    try {
      return await this.infoService.checkMRExistForGivenMoNo(req);
    } catch (err) {
      return returnException(CommonResponse, err);
    }
  }
}



