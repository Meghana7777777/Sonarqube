import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { CommonRequestAttrs, CutTableIdRequest, DateUnitCompanyRequest, FabricInwardDetailsResponse, GlobalResponseObject, GrnRollInfoResponse, MaterialRequestNoRequest, PackingListInfoModel, PackingListInfoResponse, PackingListSummaryRequest, PackingListSummaryResponse, PhBatchLotRollRequest, StockCodesRequest, StockObjectInfoResponse, SupplierCodeReq, SupplierPoSummaryResponse, SupplierWisePackListsCountReqIdDto, SupplierWisePackListsCountResponse, SuppliersResponse, TodayArrivalSummaryResponse, WhExtReqNoRequest, WhFabMaterialRequestInfoResponse, WhFabReqStatusRequest, WhMaterialRequestsResponse, WhReqCreateHeaderModel } from '@xpparel/shared-models';
import { RollIdRequest } from 'packages/libs/shared-models/src/wms/location-allocation/roll-id.request';
import { FabricRequestHandlingInfoService } from './fabric-request-handling-info.service';
import { FabricRequestHandlingService } from './fabric-request-handling.service';

@ApiTags('Fabric Request Handling')
@Controller('fabric-request-handling')
export class FabricRequestHandlingController {
  constructor(
    private readonly service: FabricRequestHandlingService,
    private readonly infoService: FabricRequestHandlingInfoService
  ) { }

  /**
   * WRITER
   * ENDPOINT
   * This will change the status to issued for the WH fab req
   * @param req 
   */
  @ApiBody({ type: WhFabReqStatusRequest})
  @Post('/changeWhFabRequestStatusToIssued')
  async changeWhFabRequestStatusToIssued(@Body() reqObj: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.changeWhFabRequestStatusToIssued(reqObj);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  /**
   * WRITER
   * ENDPOINT
   * This will change the status to issued for the WH fab req
   * @param req 
   */
  @ApiBody({ type: WhFabReqStatusRequest})
  @Post('/changeWhFabRequestStatusToPreparingMaterial')
  async changeWhFabRequestStatusToPreparingMaterial(@Body() reqObj: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.changeWhFabRequestStatusToPreparingMaterial(reqObj);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  /**
   * WRITER
   * ENDPOINT
  * This will change the status to issued for the WH fab req
   * @param req 
   */
  @ApiBody({ type: WhFabReqStatusRequest})
  @Post('/changeWhFabRequestStatusToMaterialNotAvl')
  async changeWhFabRequestStatusToMaterialNotAvl(@Body() reqObj: any): Promise<GlobalResponseObject> {
    try {
      // return await this.service.changeWhFabRequestStatusToMaterialNotAvl(reqObj);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }


}



