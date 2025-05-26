import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { CommonRequestAttrs, DistinctPLItemCategoriesModelResp, GlobalResponseObject, GrnRollInfoResponse, ItemCategoryReqModel, ItemInfoQryRespModel, ManufacturingOrderItemDataResponse, ManufacturingOrderItemRequest, PackingListInfoModel, PackingListInfoResponse, PackingListSummaryRequest, PackingListSummaryResponse, PhBatchLotRollRequest, PLHeadIdReq, RollBasicInfoResponse, RollIdConsumedQtyRequest, RollIdsRequest, StockCodesRequest, StockConsumptionRequest, StockObjectInfoResponse, SupplierCodeReq, SupplierPoSummaryResponse, SupplierWisePackListsCountReqIdDto, SupplierWisePackListsCountResponse } from '@xpparel/shared-models';
import { RollIdRequest } from 'packages/libs/shared-models/src/wms/location-allocation/roll-id.request';
import { PackingListInfoService } from './packing-list-info.service';
import { PackingListService } from './packing-list.service';
import { StockConsumptionService } from './stock-consumption.service';
import { StockInfoService } from './stock-info.service';
import { ItemInfoQryResp } from './repository/query-response/item-info.qry.resp';

@ApiTags('PackingList')
@Controller('packing-list')
export class PackingListController {
  constructor(
    private readonly packingListService: PackingListService,
    private readonly packingListInfoService: PackingListInfoService,
    private readonly stockInfoServie: StockInfoService,
    private readonly stockConsServie: StockConsumptionService
  ) { }


  @Post('createPackList')
  async createPackList(@Body() reqModel: PackingListInfoModel): Promise<GlobalResponseObject> {
    try {
      return await this.packingListService.createPackList(reqModel);
    } catch (error) {
      console.log(error);
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('validateAndDeletePackingList')
  async validateAndDeletePackingList(@Body() reqModel: PhBatchLotRollRequest) {
    try {
      return await this.packingListService.validateAndDeletePackingList(reqModel.phId, reqModel.unitCode, reqModel.companyCode)
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('getPackListInfo')
  async getPackListInfo(@Body() reqModel: PhBatchLotRollRequest): Promise<PackingListInfoResponse> {
    try {
      return await this.packingListService.getPackListInfo(reqModel);
    } catch (error) {
      return returnException(PackingListInfoResponse, error);
    }
  }


  @Post('getPoSummaryForSupplier')
  async getPoSummaryForSupplier(@Body() reqModel: SupplierCodeReq): Promise<SupplierPoSummaryResponse> {
    try {
      return await this.packingListService.getPoSummaryForSupplier(reqModel);

    } catch (error) {
      return returnException(SupplierPoSummaryResponse, error)
    }
  }

  @Post('getPackListSummery')
  async getPackListSummery(@Body() reqModel: PackingListSummaryRequest): Promise<PackingListSummaryResponse> {
    try {
      return await this.packingListService.getPackListSummery(reqModel);
    } catch (error) {
      return returnException(PackingListSummaryResponse, error)
    }
  }

  @Post('/packListNumbersDropDown')
  async packListNumbersDropDown(@Body() reqModel: CommonRequestAttrs): Promise<CommonResponse> {
    try {
      return await this.packingListService.packListNumbersDropDown(reqModel);
    } catch (error) {
      return returnException(CommonResponse, error)
    }
  }

  @Post('/getPackListsForSupplier')
  async getPackListsForSupplier(@Body() reqModel: SupplierCodeReq): Promise<CommonResponse> {
    try {
      return await this.packingListService.getPackListsForSupplier(reqModel);
    } catch (error) {
      return returnException(CommonResponse, error)
    }
  }

  @Post('/getDistinctItemCategoriesData')
  @ApiBody({ type: PLHeadIdReq })
  async getDistinctItemCategoriesData(@Body() req: PLHeadIdReq): Promise<DistinctPLItemCategoriesModelResp> {
    try {
      return await this.packingListService.getDistinctItemCategoriesData(req);
    } catch (error) {
      return returnException(DistinctPLItemCategoriesModelResp, error)
    }
  }

  @Post('/getRmPosForPackList')
  @ApiBody({ type: PLHeadIdReq })
  async getRmPosForPackList(@Body() reqModel: PLHeadIdReq): Promise<CommonResponse> {
    try {
      return await this.packingListService.getRmPosForPackList(reqModel);
    } catch (error) {
      return returnException(CommonResponse, error);
    }
  }

  @Post('printBarcodes')
  async printBarcodes(@Body() reqModel: PhBatchLotRollRequest): Promise<GlobalResponseObject> {
    try {
      return await this.packingListService.printBarcodes(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }

  @Post('releaseBarcodes')
  async releaseBarcodes(@Body() reqModel: PhBatchLotRollRequest): Promise<GlobalResponseObject> {
    try {
      return await this.packingListService.releaseBarcodes(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }

  @Post('/getGrnRollInfoForRollId')
  async getGrnRollInfoForRollId(@Body() req: RollIdRequest): Promise<GrnRollInfoResponse> {
    try {
      return await this.packingListInfoService.getGrnRollInfoForRollId(req);
    } catch (err) {
      return returnException(GrnRollInfoResponse, err)
    }
  }


  @Post('/getGrnRollInfoForRollIdGRN')
  async getGrnRollInfoForRollIdGRN(@Body() req: RollIdRequest): Promise<GrnRollInfoResponse> {
    try {
      return await this.packingListInfoService.getGrnRollInfoForRollIdGRN(req);
    } catch (err) {
      return returnException(GrnRollInfoResponse, err)
    }
  }

  // Modifed Above API Due to Client Reqirement while issuing material
  @Post('/getGrnRollInfoForRollIdAtIssuance')
  async getGrnRollInfoForRollIdAtIssuance(@Body() req: RollIdRequest): Promise<GrnRollInfoResponse> {
    try {
      return await this.packingListInfoService.getGrnRollInfoForRollIdAtIssuance(req);
    } catch (err) {
      return returnException(GrnRollInfoResponse, err)
    }
  }

  @Post('/getPackListsYetToComeSupplierWise')
  async getPackListsYetToComeSupplierWise(@Body() req: SupplierWisePackListsCountReqIdDto): Promise<SupplierWisePackListsCountResponse> {
    try {
      return await this.packingListService.getPackListsYetToComeSupplierWise(req)
    } catch (error) {
      return returnException(SupplierWisePackListsCountResponse, error)
    }
  }


  // @Post('/getFabricInwardDetails')
  // async getFabricInwardDetails(@Body() req: any): Promise<FabricInwardDetailsResponse> {
  //   console.log(req,"req")
  //   try {
  //     return await this.packingListService.getFabricInwardDetails(req);
  //   } catch (err) {
  //     return returnException(FabricInwardDetailsResponse, err)
  //   }
  // }
  @ApiBody({ type: StockCodesRequest })
  @Post('/getInStockObjectsForItemCode')
  async getInStockObjectsForItemCode(@Body() reqObj: any): Promise<StockObjectInfoResponse> {
    try {
      console.log('I WAS CALLED');
      return await this.stockInfoServie.getInStockObjectsForItemCode(reqObj);
    } catch (err) {
      return returnException(StockObjectInfoResponse, err)
    }
  }

  @ApiBody({ type: RollIdsRequest })
  @Post('/getRollsBasicInfoForRollIds')
  async getRollsBasicInfoForRollIds(@Body() reqObj: RollIdsRequest): Promise<RollBasicInfoResponse> {
    try {
      return await this.packingListService.getRollsBasicInfoForRollIds(reqObj);
    } catch (err) {
      return returnException(RollBasicInfoResponse, err)
    }
  }

  @ApiBody({ type: StockConsumptionRequest })
  @Post('/updateTheConsumedStock')
  async updateTheConsumedStock(@Body() reqObj: any): Promise<GlobalResponseObject> {
    try {
      return await this.stockConsServie.updateTheConsumedStock(reqObj);
    } catch (err) {
      return returnException(RollBasicInfoResponse, err)
    }
  }

  @Post('/getAllActivePackingList')
  async getAllActivePackingList(@Body() req: CommonRequestAttrs): Promise<CommonResponse> {
    console.log(req, "req")
    try {
      return await this.packingListService.getAllActivePackingList(req);
    } catch (err) {
      return returnException(CommonResponse, err)
    }
  }

  @Post('/updateTheAllocatedStock')
  async updateTheAllocatedStock(@Body() req: RollIdConsumedQtyRequest): Promise<GlobalResponseObject> {
    try {
      return await this.stockConsServie.updateTheAllocatedStock(req);
    } catch (err) {
      return returnException(CommonResponse, err)
    }
  }

  @Post('/updateTheIssuedStock')
  async updateTheIssuedStock(@Body() req: RollIdConsumedQtyRequest): Promise<GlobalResponseObject> {
    try {
      return await this.stockConsServie.updateTheIssuedStock(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err)
    }
  }


  @Post('/getMoItemQty')
  async getMoItemQty(@Body() req: ManufacturingOrderItemRequest): Promise<ManufacturingOrderItemDataResponse> {
    try {
      return await this.packingListService.getMoItemQty(req);
    } catch (err) {
      return returnException(ManufacturingOrderItemDataResponse, err)
    }
  }

  @Post('updatePickInspectionStatusForRollId')
  async updatePickInspectionStatusForRollId(@Body() reqObj: RollIdsRequest): Promise<CommonResponse> {
    try {
      return await this.packingListService.updatePickInspectionStatusForRollId(reqObj);
    } catch (error) {
      return returnException(CommonResponse, error)
    }
  }

  @Post('getDistinctItemInfoByCategory')
  async getDistinctItemInfoByCategory(@Body() reqObj: ItemCategoryReqModel): Promise<ItemInfoQryRespModel> {
    try {
      return await this.packingListService.getDistinctItemInfoByCategory(reqObj);
    } catch (error) {
      console.log(error)
      return returnException(ItemInfoQryRespModel, error);
    }
  }

}



