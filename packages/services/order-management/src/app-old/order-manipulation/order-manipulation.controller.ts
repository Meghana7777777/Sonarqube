import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, CreatePlanningDateRequest, GlobalResponseObject, ItemCodeInfoResponse, OpenPoDetailsResponse, OrderAndOrderListResponse, PoCreateRequest, PoNumberRequest, PoSerialRequest, ProductTypeReq, RawOrderHeaderInfoResponse, RawOrderInfoResponse, RawOrderLineBreakdownRequest, RawOrderLinePoSerialRequest, RawOrderLinesProdTypeSkuMapRequest, RawOrderNoRequest,RawOrderInfoModel, RawOrderProdTypeSkuMapRequest, RawOrderSizesRequest, ManufacturingOrderNumberRequest, ManufacturingOrderResp, SizeCodeRequest, MoCustomerInfoHelperResponse, MoDumpModal, MoListRequest, MoListResponse, MoStatusRequest, SupplierCodeReq, SupplierInfoResponse, ValidatorResponse, SewingOrderCreationRequest, SewingCreationOptionsModel, SewingCreationResponse, OrderInfoByPoSerailResponse, MoLines, MoListResponseData, PoSubLineModel, OrderLineRequest, PoSubLineResponse, OslRefIdRequest, OslIdInfoResponse, PackOrderCreationRequest, PackOrderCreationResponse } from '@xpparel/shared-models';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { OrderManipulationService } from './order-manipulation.service';
import { OrderInfoService } from './order-info.service';
import { SaleOrderInfoService } from './sale-order-Info.service';


@ApiTags('Order Manipulation')
@Controller('order-manipulation')
export class OrderManipulationController {
  constructor(
    private service: OrderManipulationService,
    private infoService: OrderInfoService,
    private soInfoService:SaleOrderInfoService
  ) {

  }

  // ----------------------------------------------------   ORDER MANIPULATION  -------------------------------------------

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  // Only saves the SO sizes
  @ApiBody({ type: RawOrderSizesRequest })
  @Post('/saveSoSizes')
  async saveSoSizes(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.saveSoSizes(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  // Only deletes the SO sizes
  @ApiBody({ type: RawOrderNoRequest })
  @Post('/deleteSoSizes')
  async deleteSoSizes(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.deleteSoSizes(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  // saves the so level pack methods 
  @ApiBody({ type: RawOrderLinesProdTypeSkuMapRequest })
  @Post('/saveSoProductTypeRmSkuMapping')
  async saveSoProductTypeRmSkuMapping(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      // saves the product type for the so lines as well as the RM skus for each so line
      return await this.service.saveSoProductTypeRmSkuMapping(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  // saves the so level pack methods 
  @ApiBody({ type: RawOrderNoRequest })
  @Post('/confirmSoProductTypeRmSkuMapping')
  async confirmSoProductTypeRmSkuMapping(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      // saves the product type for the so lines as well as the RM skus for each so line
      return await this.service.confirmSoProductTypeRmSkuMapping(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  // delete the entire so-lines and so-rm with the is_original = false flag and SO level pack methods 
  @ApiBody({ type: RawOrderNoRequest })
  @Post('/deleteSOProductTypeRmSkuMapping')
  async deleteSOProductTypeRmSkuMapping(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      // delete the product type for the so lines as well as the RM skus for each so line
      return await this.service.deleteSOProductTypeRmSkuMapping(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  @ApiBody({ type: RawOrderLineBreakdownRequest })
  @Post('/saveSoSizeQtysBreakdown')
  async saveSoSizeQtysBreakdown(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      // saves the line level size breadown for the so lines plus color of the line
      return await this.service.saveSoSizeQtysBreakdown(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  @ApiBody({ type: RawOrderNoRequest })
  @Post('/deleteSoSizeQtysBreakdown')
  async deleteSoSizeQtysBreakdown(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      // deletes the line level size breadown for the so lines
      return await this.service.deleteSoSizeQtysBreakdown(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  @ApiBody({ type: RawOrderNoRequest })
  @Post('/confirmSo')
  async confirmSo(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      // once after the confirmation, we have to save the product and sub product
      return await this.service.confirmSo(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  @ApiBody({ type: RawOrderNoRequest })
  @Post('/unConfirmSo')
  async unConfirmSo(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      // validations to be in place
      // once after the de-confirmation, we have to delete the product and sub product
      return await this.service.unConfirmSo(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }


  /**
   * READER
   * @param req 
   * @returns 
   */
  @ApiBody({ type: RawOrderNoRequest })
  @Post('/getRawOrderInfo')
  async getRawOrderInfo(@Body() req: any): Promise<RawOrderInfoResponse> {
    try {
      return await this.soInfoService.getRawOrderInfo(req);
    } catch (error) {
      return returnException(RawOrderInfoResponse, error);
    }
  }


  /**
   * WRITER
   * @param req 
   * @returns 
   */
  @ApiBody({ type: RawOrderNoRequest })
  @Post('/deleteAllOrderInfo')
  async deleteAllOrderInfo(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      // delete all the order lines and sub lines (Not the original order, but the is_original = false ones)
      return null;
    } catch (error) {
      return returnException(RawOrderInfoResponse, error);
    }
  }

  /**
   * Service to update PO serial for the order line
   * @param req 
   * @returns 
  */
  @ApiBody({ type: RawOrderLinePoSerialRequest })
  @Post('/updatePoSerialForOrderLine')
  async updatePoSerialForOrderLine(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.updatePoSerialForOrderLine(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }




  // -------------------------------------------------  ORDER SUMMARY  ------------------------------------------------


  /**
   * READER
   * @param req 
   */
  @ApiBody({ type: RawOrderNoRequest })
  @Post('/getRawOrderHeaderInfo')
  async getRawOrderHeaderInfo(@Body() req: any): Promise<RawOrderHeaderInfoResponse> {
    try {
      return await this.soInfoService.getRawOrderHeaderInfo(req);
    } catch (error) {
      return returnException(RawOrderHeaderInfoResponse, error);
    }
  }

  /**
   * READER
   * @param req 
   */
  @ApiBody({ type: MoStatusRequest })
  @Post('/getAllUnconfirmedOrders')
  async getAllUnconfirmedOrders(@Body() req: any): Promise<RawOrderInfoResponse> {
    try {
      return await this.soInfoService.getAllUnconfirmedOrders(req);
    } catch (error) {
      return returnException(RawOrderInfoResponse, error);
    }
  }
  /**
   * READER
   * @param req 
   */
  @ApiBody({ type: MoStatusRequest })
  @Post('/getOpenSo')
  async getOpenSo(@Body() req: any): Promise<RawOrderInfoResponse> {
    try {
      return await this.soInfoService.getOpenSo(req);
    } catch (error) {
      return returnException(RawOrderInfoResponse, error);
    }
  }

  /**
   * READER
   * @param req 
   */
  @ApiBody({ type: CommonRequestAttrs })
  @Post('/getInProgressSo')
  async getInProgressSo(@Body() req: any): Promise<RawOrderInfoResponse> {
    try {
      return await this.soInfoService.getInProgressSo(req);
    } catch (error) {
      return returnException(RawOrderInfoResponse, error);
    }
  }

  /**
   * READER
   * @param req 
   */
  @ApiBody({ type: CommonRequestAttrs })
  @Post('/getCompletedSo')
  async getCompletedSo(@Body() req: any): Promise<RawOrderInfoResponse> {
    try {
      return await this.infoService.getCompletedSo(req);
    } catch (error) {
      return returnException(RawOrderInfoResponse, error);
    }
  }


  /**
   * UPDATER
   * @param req 
   */
  @ApiBody({ type: CommonRequestAttrs })
  @Post('/updatePoIdToOrderLines')
  async updatePoIdToOrderLines(@Body() req: any): Promise<RawOrderInfoResponse> {
    try {
      // should get from infoService
      return null;
    } catch (error) {
      return returnException(RawOrderInfoResponse, error);
    }
  }



  // ---------------------------------------- servies used by other Micro services ------------------------------

  /**
   * READER
   * @param req 
   * @returns 
   */
  
  @ApiBody({ type: MoListRequest })
  @Post('/getListOfSo')
  async getListOfSo(@Body() req: any): Promise<MoListResponse> {
    try {
      return await this.infoService.getListOfSo(req);
    } catch (error) {
      return returnException(MoListResponse, error);
    }
  }

  /**
   * READER
   * @param req 
   * @returns 
   */
  @ApiBody({ type: PoCreateRequest })
  @Post('/getRawOrderInfoForOrderLineIds')
  async getRawOrderInfoForOrderLineIds(@Body() req: any): Promise<RawOrderInfoResponse> {
    try {
      return await this.infoService.getRawOrderInfoForOrderLineIds(req);
    } catch (error) {
      return returnException(RawOrderInfoResponse, error);
    }
  }

  @ApiBody({ type: PoSerialRequest })
  @Post('/getSoCustomerPoInfoForPoSerial')
  async getSoCustomerPoInfoForPoSerial(@Body() req: any): Promise<MoCustomerInfoHelperResponse> {
    try {
      return await this.infoService.getSoCustomerPoInfoForPoSerial(req);
    } catch (error) {
      return returnException(MoCustomerInfoHelperResponse, error);
    }
  }

  @ApiBody({ type: SizeCodeRequest })
  @Post('/checkIfSizesAlreadyUsedInExternalModule')
  async checkIfSizesAlreadyUsedInExternalModule(@Body() req: any): Promise<ValidatorResponse> {
    try {
      return await this.infoService.checkIfSizesAlreadyUsedInExternalModule(req);
    } catch (error) {
      return returnException(ValidatorResponse, error);
    }
  }

  @ApiBody({ type: ProductTypeReq })
  @Post('/checkProductTypeAlreadyUsedInExternalModule')
  async checkProductTypeAlreadyUsedInExternalModule(@Body() req: any): Promise<ValidatorResponse> {
    try {
      return await this.infoService.checkProductTypeAlreadyUsedInExternalModule(req);
    } catch (error) {
      return returnException(ValidatorResponse, error);
    }
  }

  @ApiBody({ type: ManufacturingOrderNumberRequest })
  @Post('/getOrderAndOrderLineInfo')
  async getOrderAndOrderLineInfo(@Body() req: any): Promise<OrderAndOrderListResponse> {
    try {
      return await this.infoService.getOrderAndOrderLineInfo(req);
    } catch (error) {
      return returnException(OrderAndOrderListResponse, error);
    }
  }

  @ApiBody({ type: CreatePlanningDateRequest })
  @Post('/savePlannedCutDate')
  async savePlannedCutDate(@Body() req: CreatePlanningDateRequest): Promise<GlobalResponseObject> {
    try {
      const response = await this.service.savePlannedCutDate(req);
      return response;
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @ApiBody({ type: CreatePlanningDateRequest })
  @Post('/deletePlannedCutDate')
  async deletePlannedCutDate(@Body() req: CreatePlanningDateRequest): Promise<GlobalResponseObject> {
    try {
      const response = await this.service.deletePlannedCutDate(req);
      return response;
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

    /**
   * READER
   * @param req 
   * @returns 
   */
    @ApiBody({ type: MoListRequest })
    @Post('/getListOfSoForOrderQtyRevision')
    async getListOfSoForOrderQtyRevision(@Body() req: any): Promise<MoListResponse> {
      try {
        return await this.infoService.getListOfSoForOrderQtyRevision(req);
      } catch (error) {
        return returnException(MoListResponse, error);
      }
    }
  
  
    @ApiBody({ type: RawOrderInfoModel })
    @Post('/updateOrderQtyRevision')
    async updateOrderQtyRevision(@Body() req: any): Promise<MoListResponse> {
      try {
        return await this.service.updateOrderQtyRevision(req);
      } catch (error) {
        return returnException(MoListResponse, error);
      }
    }

    @ApiBody({ type: SewingOrderCreationRequest })
    @Post('/getOrderInfoByOrderId')
    async getOrderInfoByOrderId(@Body() req: any): Promise<SewingCreationResponse> {
      try {
        return await this.infoService.getOrderInfoByOrderId(req);
      } catch (error) {
        return returnException(SewingCreationResponse, error);
      }
    }

    @ApiBody({ type: PackOrderCreationRequest })
    @Post('/getPackOrderInfoByOrderId')
    async getPackOrderInfoByOrderId(@Body() req: any): Promise<PackOrderCreationResponse> {
      try {
        return await this.infoService.getPackOrderInfoByOrderId(req);
      } catch (error) {
        return returnException(PackOrderCreationResponse, error);
      }
    }

    @ApiBody({ type: SewingOrderCreationRequest })
    @Post('/getListofMoLines')
    async getListofMoLines(@Body() req: any): Promise<MoListResponseData> {
      try {
        return await this.infoService.getListofMoLines(req);
      } catch (error) {
        return returnException(MoListResponseData, error);
      }
    }

    @ApiBody({ type: PoSerialRequest })
    @Post('/getOrderInfoByPoSerial')
    async getOrderInfoByPoSerial(@Body() req: any): Promise<OrderInfoByPoSerailResponse> {
      try {
        return await this.infoService.getOrderInfoByPoSerial(req);
      } catch (error) {
        return returnException(OrderInfoByPoSerailResponse, error);
      }
    }

    @ApiBody({ type: OrderLineRequest })
    @Post('/getOrderSubLineInfoByOrderLineId')
    async getOrderSubLineInfoByOrderLineId(@Body() req: any): Promise<PoSubLineResponse> {
      try {
        return await this.infoService.getOrderSubLineInfoByOrderLineId(req.orderLineRefNo, req.orderRefNo, req.unitCode, req.companyCode);
      } catch (error) {
        return returnException(PoSubLineResponse, error);
      }
    }

    @ApiBody({ type: PoSerialRequest })
    @Post('/getOrderSubLineInfoByPoSerial')
    async getOrderSubLineInfoByPoSerial(@Body() req: any): Promise<PoSubLineResponse> {
      try {
        return await this.infoService.getOrderSubLineInfoByPoSerial(req.poSerial, req.unitCode, req.companyCode);
      } catch (error) {
        return returnException(PoSubLineResponse, error);
      }
    }

    @ApiBody({ type: OslRefIdRequest })
    @Post('/getOrderSubLineInfoByOrderSubLineId')
    async getOrderSubLineInfoByOrderSubLineId(@Body() req: any): Promise<OslIdInfoResponse> {
      try {
        return await this.infoService.getOrderSubLineInfoByOrderSubLineId(req);
      } catch (error) {
        return returnException(OslIdInfoResponse, error);
      }
    }

}