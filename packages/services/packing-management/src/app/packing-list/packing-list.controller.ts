import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { handleResponse, returnException } from "@xpparel/backend-utils";
import { CartonBarcodeRequest, CartonDataResponse, CartonHeadInfoResponse, CartonPrintReqDto, CartonScanReqNoDto, CartonTrackInfoResp, CommonIdReqModal, CommonRequestAttrs, CommonResponse, GlobalResponseObject, PGCartonInfoResponse, PKMSCartonIdsRequest, PKMSCartonInfoResponse, PKMSPackDispatchInfoResponse, PKMSPackListIdsRequest, PKMSPackListInfoResponse, PKMSPackOrderIdRequest, PKMSPackOrderInfoResponse, PKMSManufacturingOrderIdRequest, PLAndPackJobBarCodeRequest, PLGenQtyInfoResponse, PONoRequest, PackIdRequest, PackJobsResponse, PackListCreateModel, PackListIdRequest, PackListResponseModel, PackSerialRequest, PackingListIdRequest, PlCartonWeightModel, PlCartonWeightResponse, PoIdRequest, ScanToPackRequest, UpcBarCodeReqDto, CartonBarCodesReqDto, MoNumberResDto, ItemsResponse, CartonFillingResponse, ExtFgBarCodeReqDto } from "@xpparel/shared-models";
import { PackingListInfoService } from "./packing-list.info.service";
import { PackListService } from "./packing-list.service";


@ApiTags('PackingList')
@Controller('pack-list')
export class PackingListController {
  constructor(
    private readonly pLService: PackListService,
    private readonly pliService: PackingListInfoService
  ) { }

  @Post('/savePackListInfo')
  async savePackListInfo(@Body() req: PackListCreateModel): Promise<GlobalResponseObject> {
    return handleResponse(
      async () => this.pLService.savePackListInfo(req),
      GlobalResponseObject
    );
  }

  @Post('/deletePackList')
  async deletePackList(@Body() req: CommonIdReqModal): Promise<GlobalResponseObject> {
    return handleResponse(
      async () => this.pLService.deletePackList(req),
      GlobalResponseObject
    );
  }

  @Post('/getPackingListDataById')
  async getPackingListDataById(@Body() req: CommonIdReqModal): Promise<PackListResponseModel> {
    return handleResponse(
      async () => this.pLService.getPackingListDataById(req),
      PackListResponseModel
    )
  }

  @Post('/getPoToPLGenQtyInfo')
  async getPoToPLGenQtyInfo(@Body() dto: PackSerialRequest): Promise<PLGenQtyInfoResponse> {
    return handleResponse(
      async () => this.pliService.getPoToPLGenQtyInfo(dto),
      PLGenQtyInfoResponse
    );
  }

  @Post('/getPackListsForPo')
  async getPackListsForPo(@Body() dto: PONoRequest): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pLService.getPackListsForPo(dto),
      CommonResponse
    );
  }

  @Post('/getCartonPrintData')
  async getCartonPrintData(@Body() dto: CartonPrintReqDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pLService.getCartonPrintData(dto),
      CommonResponse
    );
  }

  @Post('/getPackJobsForPackListId')
  async getPackJobsForPackListId(@Body() dto: PackingListIdRequest): Promise<PackJobsResponse> {
    return handleResponse(
      async () => this.pLService.getPackJobsForPackListId(dto),
      PackJobsResponse
    );
  }

  @Post('/printBarcodesForPackListId')
  async printBarcodesForPackListId(@Body() dto: PLAndPackJobBarCodeRequest): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pLService.printBarcodesForPackListId(dto),
      CommonResponse
    );
  }

  @Post('/releaseBarcodesPrintForPackListId')
  async releaseBarcodesPrintForPackListId(@Body() dto: PLAndPackJobBarCodeRequest): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pLService.releaseBarcodesPrintForPackListId(dto),
      CommonResponse
    );
  }

  @Post('/printBarCodesForPackJob')
  async printBarcodesForPackJob(@Body() reqModel: PLAndPackJobBarCodeRequest): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pLService.printBarcodesForPackJob(reqModel),
      CommonResponse
    );
  }

  @Post('/releaseBarcodesPrintForPackJob')
  async releaseBarcodesPrintForPackJob(@Body() reqModel: PLAndPackJobBarCodeRequest): Promise<CommonResponse> {
    try {
      return await this.pLService.releaseBarcodesPrintForPackJob(reqModel);
    } catch (error) {
      return returnException(CommonResponse, error)
    }
  }

  @Post('/getFgCartonFillingData')
  async getFgCartonFillingData(@Body() reqModel: CartonScanReqNoDto): Promise<CartonFillingResponse> {
    try {
      return await this.pLService.getFgCartonFillingData(reqModel);
    } catch (error) {
      return returnException(CartonFillingResponse, error)
    }
  };

  @Post('/cartonsFillingInCartonsLevel')
  async cartonsFillingInCartonsLevel(@Body() reqModel: CartonScanReqNoDto): Promise<CommonResponse> {
    try {
      return await this.pLService.cartonsFillingInCartonsLevel(reqModel);
    } catch (error) {
      return returnException(CommonResponse, error)
    }
  };

  

  @Post('/scanBarCodeToCartonPack')
  async scanBarCodeToCartonPack(@Body() reqModel: ScanToPackRequest): Promise<CommonResponse> {
    try {
      return await this.pLService.scanBarCodeToCartonPack(reqModel);
    } catch (error) {
      return returnException(CommonResponse, error)
    }
  }

  @Post('/getCartonDataForInspection')
  async getCartonDataForInspection(@Body() reqModel: PoIdRequest): Promise<CartonDataResponse> {
    try {
      return await this.pLService.getCartonDataForInspection(reqModel);
    } catch (error) {
      return returnException(CartonDataResponse, error)
    }
  };


  @Post('/scanGarmentBarcode')
  async scanGarmentBarcode(@Body() dto: UpcBarCodeReqDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pLService.scanGarmentBarcode(dto),
      CommonResponse
    );
  }

  @Post('/scanExtGarmentBarcode')
  async scanExtGarmentBarcode(@Body() dto: ExtFgBarCodeReqDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pLService.scanExtGarmentBarcode(dto),
      CommonResponse
    );
  }


  @Post('/getPackListData')
  async getPackListData(@Body() dto: PackIdRequest): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pLService.getPackListData(dto),
      CommonResponse
    );
  }

  @Post('/getPackListDropDown')
  async getPackListDropDown(@Body() dto: CommonRequestAttrs): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pLService.getPackListDropDown(dto),
      CommonResponse
    );
  }


  @Post('/getPackListByPoId')
  async getPackListByPoId(@Body() req: PoIdRequest): Promise<CommonResponse> {
    return handleResponse(async () => this.pLService.getPackListByPoId(req), CommonResponse)
  }

  @Post('/getPGCartonInfoForCartonBarcode')
  async getPGCartonInfoForCartonBarcode(@Body() req: ScanToPackRequest): Promise<PGCartonInfoResponse> {
    return handleResponse(async () => this.pliService.getPGCartonInfoForCartonBarcode(req), PGCartonInfoResponse)
  }

  @Post('/getPackListDetails')
  async getPackListDetails(@Body() dto: PackListIdRequest): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pLService.getPackListDetails(dto),
      CommonResponse
    );
  };

  @Post('/getPackOrderInfoByManufacturingOrderIds')
  async getPackOrderInfoByManufacturingOrderIds(@Body() dto: PKMSManufacturingOrderIdRequest): Promise<PKMSPackOrderInfoResponse> {
    return handleResponse(
      async () => this.pLService.getPackOrderInfoByManufacturingOrderIds(dto),
      PKMSPackOrderInfoResponse
    );
  }

  @Post('/getPackingDispatchInfoByPackListId')
  async getPackingDispatchInfoByPackListId(@Body() dto: PKMSPackListIdsRequest): Promise<PKMSPackDispatchInfoResponse> {
    return handleResponse(
      async () => this.pLService.getPackingDispatchInfoByPackListId(dto),
      PKMSPackDispatchInfoResponse
    );
  }

  @Post('/getPackOrderInfoByPackOrderId')
  async getPackOrderInfoByPackOrderId(@Body() dto: PKMSPackOrderIdRequest): Promise<PKMSPackOrderInfoResponse> {
    return handleResponse(
      async () => this.pLService.getPackOrderInfoByPackOrderId(dto),
      PKMSPackOrderInfoResponse
    );
  }

  @Post('/getPackListInfoByPackListId')
  async getPackListInfoByPackListId(@Body() dto: PKMSPackListIdsRequest): Promise<PKMSPackListInfoResponse> {
    return handleResponse(
      async () => this.pLService.getPackListInfoByPackListId(dto),
      PKMSPackListInfoResponse
    );
  }

  @Post('/getCartonsByCartonId')
  async getCartonsByCartonId(@Body() dto: PKMSCartonIdsRequest): Promise<PKMSCartonInfoResponse> {
    return handleResponse(
      async () => this.pLService.getCartonsByCartonId(dto),
      PKMSCartonInfoResponse
    );
  }

  @Post('/getBarcodeHeadInfo')
  async getBarcodeHeadInfo(@Body() dto: CartonBarcodeRequest): Promise<CartonHeadInfoResponse> {
    return handleResponse(
      async () => this.pLService.getBarcodeHeadInfo(dto),
      CartonHeadInfoResponse
    );
  }

  @Post('/getCartonTrackInfo')
  async getCartonTrackInfo(@Body() dto: CartonBarcodeRequest): Promise<CartonTrackInfoResp> {
    return handleResponse(
      async () => this.pLService.getCartonTrackInfo(dto),
      CartonTrackInfoResp
    );
  }

  @Post('/getCartonWeightDetails')
  async getCartonWeightDetails(@Body() pkListReq: PackingListIdRequest): Promise<PlCartonWeightResponse> {
    return handleResponse(
      async () => this.pLService.getCartonWeightDetails(pkListReq),
      PlCartonWeightResponse
    );
  }

  @Post('/upDateCartonWeightDetails')
  async upDateCartonWeightDetails(@Body() plCartonWeightModel: PlCartonWeightModel): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pLService.upDateCartonWeightDetails(plCartonWeightModel),
      CommonResponse
    );
  }


  @Post('/isCartonPackingDone')
  async isCartonPackingDone(@Body() req: CartonBarCodesReqDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pliService.isCartonPackingDone(req),
      CommonResponse
    );
  }

  @Post('/getOMSItemsForPKMS')
  async getOMSItemsForPKMS(@Body() req: MoNumberResDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.pLService.getOMSItemsForPKMS(req),
      CommonResponse
    );
  }

  @Post('/getBOMItemsForPackOrder')
  async getBOMItemsForPackOrder(@Body() req: PoIdRequest): Promise<ItemsResponse> {
    return handleResponse(
      async () => this.pliService.getBOMItemsForPackOrder(req),
      ItemsResponse
    );
  }




}