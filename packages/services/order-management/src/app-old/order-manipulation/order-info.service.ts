import { Injectable, NotFoundException } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CommonRequestAttrs, CommonResponse, FeatureGrouping, getChunkRecords, OrderAndOrderListModel, OrderAndOrderListResponse, OrderInfoByPoSerailModel, OrderInfoByPoSerailResponse, OslIdInfoModel, OslIdInfoResponse, OslRefIdRequest, PackFeatureGrouping, PackOrderCreationModel, PackOrderCreationOptionsEnum, PackOrderCreationRequest, PackOrderCreationResponse, PackMoLineInfo, PackSubLineIdsByOrderNoRequest, PackSubLineInfo, PoCreateRequest, PoOrderSubLineModel, PoSerialRequest, PoSubLineResponse, ProductItemModel, ProductTypeReq, RawOrderHeaderInfoModel, RawOrderHeaderInfoResponse, RawOrderInfoModel, RawOrderInfoResponse, RawOrderLineInfoModel, RawOrderLineRmModel, RawOrderNoRequest, RawOrderPackMethodModel, RawOrderSubLineInfoModel, RmCompMapModel, ManufacturingOrderNumberRequest, SewingCreationOptionsEnum, SewingCreationOptionsModel, SewingCreationResponse, SewingOrderCreationRequest, SizeCodeRequest, MoCustomerInfoHelperModel, MoCustomerInfoHelperResponse, MoLineInfo, MoLines, MoListModel, MoListRequest, MoListResponse, MoListResponseData, MoProductStatusEnum, MoStatusEnum, MoStatusRequest, SubLineIdsByOrderNoRequest, SubLineInfo, SubProductItemModel, ValidatorResponse } from "@xpparel/shared-models";
import { DataSource, In, IsNull, Not } from "typeorm";
import { OrderLineRmEntity } from "../common/entity/order-line-rm.entity";
import { OrderLineEntity } from "../common/entity/order-line.entity";
import { OrderSizesEntity } from "../common/entity/order-sizes.entity";
import { OrderSubLineEntity } from "../common/entity/order-sub-line.entity";
import { OrderEntity } from "../common/entity/order.entity";
import { OrderLineOpRmRepository } from "../common/repository/order-line-op-rm.repository";
import { OrderLineOpRepository } from "../common/repository/order-line-op.repository";
import { OrderLineRmRepository } from "../common/repository/order-line-rm.repository";
import { OrderLineRepository } from "../common/repository/order-line.repository";
import { OrderPackMethodRepository } from "../common/repository/order-pack-method.repository";
import { OrderSizesRepository } from "../common/repository/order-sizes.repository";
import { OrderSubLineRmRepository } from "../common/repository/order-sub-line-rm.repository";
import { OrderSubLineRepository } from "../common/repository/order-sub-line.repository";
import { OrderRepository } from "../common/repository/order.repository";
import { orderAndOrderlineQueryResponse } from "../common/repository/query-response/order-and-order-line-query.response";
import { ProductEntity } from "../product-prototype/entity/product.entity";
import { OrderManipulationHelperService } from "./order-manipulation-helper.service";
import { OrderInfoByPoSerailQueryResponse } from "../common/repository/query-response/order-info-by-poserial-query.response";
import { PreIntegrationServicePKMS, SewingOrderCreationService } from "@xpparel/shared-services";
const moment = require("moment");

@Injectable()
export class OrderInfoService {
  constructor(
    private dataSource: DataSource,
    private orderManipulationHelper: OrderManipulationHelperService,
    private orderRepo: OrderRepository,
    private orderLineRepo: OrderLineRepository,
    private orderSubLineRepo: OrderSubLineRepository,
    private orderLineOpRepo: OrderLineOpRepository,
    private orderLineRmRepo: OrderLineRmRepository,
    private orderLineOpRmRepo: OrderLineOpRmRepository,
    private orderSubLineRmRepo: OrderSubLineRmRepository,
    private orderSizesRepo: OrderSizesRepository,
    private packMethodRepo: OrderPackMethodRepository,
    private sewingOrderService: SewingOrderCreationService,
    private packingOrderService: PreIntegrationServicePKMS,

  ) {

  }

  /**
   * Service to get order raw details for given order no
   * @param orderNo 
   * @param unitCode 
   * @param companyCode 
   * @returns Order details entity
  */
  async getOrderDetailsByOrderId(orderId: number, unitCode: string, companyCode: string): Promise<OrderEntity> {
    return await this.orderRepo.findOne({ where: { id: orderId, unitCode, companyCode, isActive: true } });
  }

  /**
   * Service to get the oder sizes by order Id
   * @param orderId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
   */
  async getOrderSizesByOrderId(orderId: number, unitCode: string, companyCode: string): Promise<OrderSizesEntity[]> {
    return await this.orderSizesRepo.find({ where: { orderId: orderId, unitCode, companyCode, isActive: true } })
  }

  /**
   * Service to get the order line details by order Id
   * @param orderId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getOrderLineDetailsByOrderId(orderId: number, unitCode: string, companyCode: string, iNeedOriginalMoLines?: boolean): Promise<OrderLineEntity[]> {
    const orderObj = new OrderEntity();
    orderObj.id = orderId;
    let where = { orderId: orderObj, unitCode, companyCode, isActive: true }
    if (iNeedOriginalMoLines) {
      where['isOriginal'] = true
    }
    console.log(where, 'where')
    return await this.orderLineRepo.find({ where });
  }

  /**
   * Service to get order sub line details by order no
   * @param orderId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getOrderSubLineDetailsByOrderId(orderId: number, unitCode: string, companyCode: string): Promise<OrderSubLineEntity[]> {
    return await this.orderSubLineRepo.find({ where: { orderId, unitCode, companyCode, isActive: true } })
  }

  /**
   * Service to get order line details by order line Id
   * @param orderLineId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getOrderLineDetailsByOrderLineId(orderLineId: number, unitCode: string, companyCode: string): Promise<OrderLineEntity> {
    return await this.orderLineRepo.findOne({ where: { id: orderLineId, unitCode, companyCode, isActive: true } })
  }

  /**
   * Service to get order rm sku mapping by order Id
   * @param orderId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getOrderRmSkuMappingByOrderId(orderId: number, unitCode: string, companyCode: string): Promise<OrderLineRmEntity[]> {
    return await this.orderLineRmRepo.find({ where: { orderId, unitCode, companyCode, isActive: true } })
  }

  /**
   * Service to get order rm sku mapping by order Id
   * @param orderId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getOrderRmSkuMappingByOrderLineId(orderLineId: number, unitCode: string, companyCode: string): Promise<OrderLineRmEntity[]> {
    const orderLineEnt = new OrderLineEntity();
    orderLineEnt.id = orderLineId;
    return await this.orderLineRmRepo.find({ where: { orderLineId: orderLineEnt, unitCode, companyCode } })
  }

  /**
   * Service to get order sub line details by order no
   * @param orderId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getOrderSubLineDetailsByOrderLineId(orderLineId: number, unitCode: string, companyCode: string): Promise<OrderSubLineEntity[]> {
    const orderLineObj = new OrderLineEntity();
    orderLineObj.id = orderLineId;
    return await this.orderSubLineRepo.find({ where: { orderLineId: orderLineObj, unitCode, companyCode, isActive: true } })
  }

  /**
   * gets the duplicated order line if any i.e just to check if the pack method order is confirmed or not
   * @param orderId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
   */
  async getAtleast1DupOrderLineByOrderId(orderId: number, unitCode: string, companyCode: string): Promise<OrderLineEntity> {
    const orderEnt = new OrderEntity();
    orderEnt.id = orderId;
    return await this.orderLineRepo.findOne({ where: { orderId: orderEnt, unitCode, companyCode, isActive: true, isOriginal: false } });
  }

  /**
   * HELPER for product-prototype service
   * gets the combination of products in the SO, to be created in the product and sub product tables
   * @param orderId 
   * @param companyCode 
   * @param unitCode 
   * @returns 
   */
  async getGroupedProductsAndSubProductsRmForOrder(orderId: number, companyCode: string, unitCode: string): Promise<ProductItemModel> {
    // get the order (product)
    const orderRec = await this.orderRepo.findOne({ select: ['orderNo', 'productCode', 'productType', 'id', 'vpo', 'co', 'styleCode', 'styleDesc', 'styleName'], where: { id: orderId, companyCode: companyCode, unitCode: unitCode, isActive: true } });
    if (!orderRec) {
      throw new ErrorResponse(1025, 'Order does not exist : ' + orderId);
    }
    const subProducts: SubProductItemModel[] = [];
    // get all the order lines (sub products) grouped by product type and color
    // combination key = SO + product_type + color
    const subProudctCombinations = await this.orderLineRepo.getSoProductTypeColorCombinations(orderId, companyCode, unitCode);
    if (subProudctCombinations.length == 0) {
      throw new ErrorResponse(1026, 'Sub product comninations doesnt exist');
    }
    // for each and every combinations, we have to get the RM
    for (const subProd of subProudctCombinations) {
      // get all the unique RM for the sub products. Usually if more than 1 line exist with same prod type + color combination, then the RM must also be same accross the lines
      const consumedSkus: string[] = [];
      const lineIds = subProd.line_ids?.split(',');
      const rmItmes = await this.orderLineRmRepo.find({ where: { orderLineId: In(lineIds), isActive: true, companyCode: companyCode, unitCode: unitCode } });
      const subProdItemModels: RmCompMapModel[] = [];
      rmItmes.forEach(i => {
        // if the item is already pushed then do not push it again
        if (!consumedSkus.includes(i.itemCode)) {
          subProdItemModels.push(new RmCompMapModel(i.itemCode, i.itemName, i.itemDesc, i.itemColor, null, i.itemType, i.itemSubType, i.sequence, null));
        }
        consumedSkus.push(i.itemCode);
      });
      subProducts.push(new SubProductItemModel(orderRec.orderNo, null, null, subProdItemModels, subProd.style_name, subProd.style_code, subProd.style_description, subProd.product_sub_type, subProd.sub_product_name, subProd.color_desc, null, null));
    }
    const productModel = new ProductItemModel(orderRec.orderNo, orderRec.id, subProducts, orderRec.styleName, orderRec.styleCode, orderRec.styleDesc, orderRec.productType, 0, null, null);
    return productModel;
  }

  /**
   * should get from infoService
   * @param req 
   * @returns 
  */
  async getRawOrderInfo(req: RawOrderNoRequest): Promise<RawOrderInfoResponse> {
    try {
      const unitCode = req.unitCode;
      const companyCode = req.companyCode;
      const orderDetails = await this.getOrderDetailsByOrderId(req.orderId, unitCode, companyCode);

      if (!orderDetails) {
        throw new ErrorResponse(1027, 'Order no not exists. Please check and try again!!!');
      }
      let sizeBreakDownDone = false;
      const orderSizes = await this.getOrderSizesByOrderId(req.orderId, unitCode, companyCode);
      const sizes = orderSizes.map(size => size.size);
      const rmSkuDetails = await this.getOrderRmSkuMappingByOrderId(req.orderId, unitCode, companyCode);
      const dupLineItem = await this.getAtleast1DupOrderLineByOrderId(req.orderId, unitCode, companyCode);
      const packMethodConfirmed = dupLineItem ? true : false;
      const orderMoLines = [];
      let garmentVendor = '';
      let garmentTrue = '';
      let buyerPo = '';
      let buyerPoline = '';
      let garmentPo = '';
      let garmentPoLine = '';
      const productInfo: ProductEntity = await this.orderManipulationHelper.getProductRecordSaleOrderId(req.orderId, unitCode, companyCode);
      // if (req.iNeedMoLines) {
      //   const orderLines: OrderLineEntity[] = await this.getOrderLineDetailsByOrderId(req.orderId, unitCode, companyCode, req.iNeedOriginalMoLines);
      //   for (const orderLine of orderLines) {
      //     const orderSubLines: RawOrderSubLineInfoModel[] = [];
      //     const orderLineRmDetails: RawOrderLineRmModel[] = [];
      //     const rmSkuDetails = await this.getOrderRmSkuMappingByOrderLineId(orderLine.id, unitCode, companyCode);
      //     const skuMapped = rmSkuDetails?.length ? true : false;
      //     const subOrderDetails = await this.getOrderSubLineDetailsByOrderLineId(orderLine.id, unitCode, companyCode);
      //     const sizesMapped = subOrderDetails?.length ? true : false;
      //     subOrderDetails.length > 0 ? sizeBreakDownDone = true : '';
      //     if (req.iNeedMoLineSubLines) {
      //       for (const eachSubLine of subOrderDetails) {
      //         const subLineInfo = new RawOrderSubLineInfoModel(orderLine.id, eachSubLine.id, eachSubLine.iRefNo, eachSubLine.colorDesc, eachSubLine.sizeCode, eachSubLine.quantity, eachSubLine.eRefNo, eachSubLine.eRefNo, [], []);
      //         orderSubLines.push(subLineInfo);
      //       }
      //     }
      //     if (req.iNeedMoLineRm) {
      //       for (const eachRm of rmSkuDetails) {
      //         const rmDetails = new RawOrderLineRmModel(eachRm.itemCode, eachRm.itemDesc, eachRm.itemColor, eachRm.itemCode, eachRm.itemType, eachRm.itemSubType, eachRm.itemConsumption, eachRm.itemWastage, eachRm.fabricMeters);
      //         orderLineRmDetails.push(rmDetails);
      //       }
      //     }
      //     const orderLineInfo = new RawOrderLineInfoModel(orderLine.id, orderLine.orderLineNo,
      //       orderLine.colorDesc, orderLine.quantity, orderLine.orderLineNo, orderLine.deliveryDate, orderLine.destination, null, orderLine.subProductName, orderLine.productSubType, orderLine.eRefNo, orderLine.isOriginal, orderLine.combinationRef, skuMapped, sizesMapped, orderSubLines, orderLineRmDetails, [], sizes, Number(orderLine.poSerial), orderLine.buyerPo, orderLine.subProductName, orderLine.plannedCutDate, orderLine.plannedProductionDate, orderLine.plannedDeliveryDate, orderLine.parentId);
      //     orderMoLines.push(orderLineInfo);
      //     garmentVendor = orderLine.garmentVendorName;
      //     garmentTrue = orderLine.garmentVendorUnit;
      //     buyerPo = orderLine.buyerPo;
      //     buyerPoline = '';
      //     garmentPo = orderLine.garmentVendorPo;
      //     garmentPoLine = '';
      //   }

      // }
      orderMoLines.sort((a, b) => Number(a.orderLineNo) - Number(b.orderLineNo));
      const packMethodModels = await this.getPackMethodModelsForOrderId(req.orderId, companyCode, unitCode);
      const orderInfo = new RawOrderInfoModel(orderDetails.id, orderDetails.orderNo, orderDetails.vpo, orderDetails.productType, orderDetails.quantity, orderDetails.styleCode, orderDetails.refId, orderDetails.styleName, orderDetails.styleDesc, orderDetails.customerCode, orderDetails.buyerDesc, orderDetails.packMethod, garmentVendor, garmentTrue, packMethodConfirmed, orderDetails.isConfirmed, sizeBreakDownDone, orderMoLines, sizes, packMethodModels, productInfo ? productInfo.confirmationStatus : MoProductStatusEnum.OPEN, garmentPo, buyerPo, buyerPoline, garmentPoLine, orderDetails.plantStyle, orderDetails.plannedCutDate,);
      return new RawOrderInfoResponse(true, 1, '', [orderInfo]);
    } catch (error) {
      // console.log(error);
      return error;
    }
  }

  /**
   * 
   * @param orderId 
   * @param companyCode 
   * @param unitCode 
   * @returns 
   */
  async getPackMethodModelsForOrderId(orderId: number, companyCode: string, unitCode: string): Promise<RawOrderPackMethodModel[]> {
    const packMethods: RawOrderPackMethodModel[] = [];
    const packMethodsForSo = await this.packMethodRepo.find({ where: { orderId: orderId, companyCode: companyCode, unitCode: unitCode } });
    packMethodsForSo.forEach(rec => {
      packMethods.push(new RawOrderPackMethodModel(rec.productName, rec.productType, rec.iCodes?.split(','), rec.orderId));
    })
    return packMethods;
  }

  /**
   * Service to get Open Sale Orders
   * @param req 
   * @returns 
  */
  async getOpenSo(req: MoStatusRequest): Promise<RawOrderInfoResponse> {
    try {
      const iNeedOnlyPlantStyleUpdatesSos = req.iNeedOnlyPlantStyleUpdatesMos;
      const plantStyleData = iNeedOnlyPlantStyleUpdatesSos === true ? { plannedCutDate: Not(IsNull()), plantStyle: Not(IsNull()) } : {};
      const ordersInfo: RawOrderInfoModel[] = [];
      const openOrderInfo = await this.orderRepo.find({ select: ['id'], where: { soProgressStatus: MoStatusEnum.OPEN, ...plantStyleData }, order: { plannedCutDate: iNeedOnlyPlantStyleUpdatesSos ? 'ASC' : 'DESC' } });
      for (const eachOrder of openOrderInfo) {
        const reqObj = new RawOrderNoRequest(req.username, req.unitCode, req.companyCode, req.userId, null, eachOrder.id, null, null, null, false, false, false, false, false);
        const orderInfo = await this.getRawOrderInfo(reqObj);
        if (!orderInfo.status) {
          return orderInfo;
        }
        ordersInfo.push(...orderInfo.data);
      }
      return new RawOrderInfoResponse(true, 1, '', ordersInfo);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Service to get Open Sale Orders
   * @param req 
   * @returns 
  */
  async getInProgressSo(req: CommonRequestAttrs): Promise<RawOrderInfoResponse> {
    try {
      const ordersInfo: RawOrderInfoModel[] = [];
      const openOrderInfo = await this.orderRepo.find({ select: ['id'], where: { soProgressStatus: MoStatusEnum.IN_PROGRESS,orderNo:'423265_2210'},take: 2 });
      for (const eachOrder of openOrderInfo) {
        const reqObj = new RawOrderNoRequest(req.username, req.unitCode, req.companyCode, req.userId, null, eachOrder.id, null, null, null, false, false, false, false, false);
        const orderInfo = await this.getRawOrderInfo(reqObj);
        if (!orderInfo.status) {
          return orderInfo;
        }
        ordersInfo.push(...orderInfo.data);
      }
      return new RawOrderInfoResponse(true, 1, '', ordersInfo);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Service to get Open Sale Orders
   * @param req 
   * @returns 
  */
  async getCompletedSo(req: CommonRequestAttrs): Promise<RawOrderInfoResponse> {
    try {
      const ordersInfo: RawOrderInfoModel[] = [];
      const openOrderInfo = await this.orderRepo.find({ select: ['id'], where: { soProgressStatus: MoStatusEnum.COMPLETED } });
      for (const eachOrder of openOrderInfo) {
        const reqObj = new RawOrderNoRequest(req.username, req.unitCode, req.companyCode, req.userId, null, eachOrder.id, null, null, null, false, false, false, false, false);
        const orderInfo = await this.getRawOrderInfo(reqObj);
        if (!orderInfo.status) {
          return orderInfo;
        }
        ordersInfo.push(...orderInfo.data);
      }
      return new RawOrderInfoResponse(true, 1, '', ordersInfo);
    } catch (error) {
      throw error;
    }
  }


  /**
   * gets the raw order info for the order line ids
   * @param req 
   * @returns 
   */
  async getRawOrderInfoForOrderLineIds(req: PoCreateRequest): Promise<RawOrderInfoResponse> {
    return null;
  }


  /**
   * READER used in PPS-PO Create
   * @param req 
   * @returns 
   */
  async getListOfSo(req: MoListRequest): Promise<MoListResponse> {
    try {
      const { unitCode, companyCode } = req;
      const openOrderInfo = await this.orderRepo.find({ where: { unitCode, companyCode, isActive: true, soProgressStatus: MoStatusEnum.IN_PROGRESS } });
      if (openOrderInfo.length) {
        return new MoListResponse(true, 1, '', openOrderInfo.map(rec => new MoListModel(rec.orderNo, rec.id, rec.styleCode, rec.buyerDesc, rec.plantStyle)));
      } else {
        return new CommonResponse(true, 2, '', []);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 
   * @param req 
   * @returns 
   */
  async getRawOrderHeaderInfo(req: RawOrderNoRequest): Promise<RawOrderHeaderInfoResponse> {
    if (!req.orderId) {
      throw new ErrorResponse(1028, 'Order id is not provided');
    }
    const orderRec = await this.getOrderDetailsByOrderId(req.orderId, req.unitCode, req.companyCode);
    if (!orderRec) {
      throw new ErrorResponse(1029, 'Order doest not exist for id : ' + req.orderId);
    }
    let sizesConfirmed = false;
    let packMethodConfirmed = false;
    let sizeBreakConfirmed = false;
    let productConfirmed = false;
    const sizes = await this.orderSizesRepo.findOne({ select: ['id'], where: { orderId: req.orderId, companyCode: req.companyCode, unitCode: req.unitCode } });
    sizesConfirmed = sizes ? true : false;
    const packMethod = await this.packMethodRepo.findOne({ select: ['id'], where: { orderId: req.orderId, companyCode: req.companyCode, unitCode: req.unitCode } });
    packMethodConfirmed = packMethod ? true : false;
    const sizeBreaks = await this.orderSubLineRepo.findOne({ select: ['id'], where: { orderId: req.orderId, companyCode: req.companyCode, unitCode: req.unitCode } });
    sizeBreakConfirmed = sizeBreaks ? true : false;
    const prodRecord = await this.orderManipulationHelper.getProductRecordSaleOrderId(req.orderId, req.unitCode, req.companyCode);
    productConfirmed = prodRecord?.confirmationStatus == MoProductStatusEnum.CONFIRMED;
    const headerModel = new RawOrderHeaderInfoModel(orderRec.styleName, orderRec.styleDesc, orderRec.buyerDesc, orderRec.orderNo, orderRec.co, orderRec.profitCenterName, sizesConfirmed, packMethodConfirmed, sizeBreakConfirmed, 0, productConfirmed);
    return new RawOrderHeaderInfoResponse(true, 0, 'Header info retrieved', [headerModel]);
  }

  // ENDPOINT
  // Helpful for getting all the prodution order related order attributes
  async getSoCustomerPoInfoForPoSerial(req: PoSerialRequest): Promise<MoCustomerInfoHelperResponse> {
    if (!req.poSerial) {
      throw new ErrorResponse(1031, 'Po serial is not provided');
    }
    const poInfo = await this.orderManipulationHelper.getPoInfoForPoSerial(req.poSerial, req.companyCode, req.unitCode);
    const soLineModels: MoCustomerInfoHelperModel[] = [];
    const soLines = await this.orderLineRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial }, relations: ['orderId'] });
    for (const ol of soLines) {
      const orderLineAttrs = new MoCustomerInfoHelperModel(ol.orderId.co, ol.orderId.productName, null, ol.deliveryDate, ol.orderId.customerCode, ol.orderId.customerName, ol.styleCode, ol.styleDesc, ol.orderId.orderNo, ol.orderLineNo, ol.buyerPo, ol.garmentVendorName, ol.garmentVendorPo, ol.garmentVendorUnit, ol.quantity, poInfo?.poDesc, ol.productSubType, ol.orderId.plantStyle);
      soLineModels.push(orderLineAttrs);
    }
    return new MoCustomerInfoHelperResponse(true, 1032, 'Order attributes retrieved for the prouction order', soLineModels);
  }

  async checkIfSizesAlreadyUsedInExternalModule(req: SizeCodeRequest): Promise<ValidatorResponse> {
    const sizeExists = await this.orderSizesRepo.findOne({ where: { size: req.sizeCode, unitCode: req.unitCode, companyCode: req.companyCode } });

    if (sizeExists) {
      return new ValidatorResponse(true, 1033, 'Size code cannot be deleted', true);
    }
    return new ValidatorResponse(true, 1034, 'Size code not found', false);
  }

  async checkProductTypeAlreadyUsedInExternalModule(req: ProductTypeReq): Promise<ValidatorResponse> {
    const productTypeExists = await this.packMethodRepo.findOne({ where: { productType: req.productType, unitCode: req.unitCode, companyCode: req.companyCode } });

    if (productTypeExists) {
      return new ValidatorResponse(true, 1035, 'Product type cannot be deleted', true);
    }
    return new ValidatorResponse(true, 1036, 'Product type not found', false);
  }

  /**
  * 
  * @param orderId 
  * @param companyCode 
  * @param unitCode 
  * @returns 
  */
  async getOrderAndOrderLineInfo(req: ManufacturingOrderNumberRequest): Promise<OrderAndOrderListResponse> {
    try {
      const orderInformaiton: orderAndOrderlineQueryResponse[] = await this.orderLineRepo.getOrderAndOrderLineInformation(req.manufacturingOrderNos[0], req.companyCode, req.unitCode);
      const OrderAndOrderListresponse: OrderAndOrderListModel[] = [];
      if (!orderInformaiton) {
        throw new ErrorResponse(924, 'No Data Found');
      }
      for (const orderInfo of orderInformaiton) {
        const orderinfo = new OrderAndOrderListModel(orderInfo.order_no, orderInfo.order_line_no, orderInfo.plant_style, orderInfo.style_description, orderInfo.style_code, orderInfo.style_name, orderInfo.garment_vendor_code, orderInfo.garment_vendor_name, orderInfo.garment_vendor_po_item, orderInfo.garment_vendor_po, orderInfo.buyer_loc, orderInfo.customer_name, orderInfo.customer_code, orderInfo.profit_center_code, orderInfo.profit_center_name, orderInfo.product_name, orderInfo.product_category);
        OrderAndOrderListresponse.push(orderinfo);
      }
      return new OrderAndOrderListResponse(true, 1038, 'Docket information retrieved successfully', OrderAndOrderListresponse);
    } catch (error) {
      throw error;
    }

  }
  /**
   * @param req MoListRequest
   */
  async getListOfSoForOrderQtyRevision(req: MoListRequest): Promise<MoListResponse> {
    try {
      const { unitCode, companyCode } = req;
      const openOrderIds = await this.orderRepo.find({ where: { unitCode, companyCode, isActive: true, soProgressStatus: In([MoStatusEnum.OPEN, MoStatusEnum.IN_PROGRESS]), isConfirmed: false } });
      const chunkData = getChunkRecords(openOrderIds, 600);
      const colorExistIds = []
      for (const chunk of chunkData) {
        const orderIds = chunk.map(rec => rec.id);
        const colorExistRecords = await this.orderSubLineRepo.find({ select: ['orderId'], where: { orderId: In(orderIds) } });
        colorExistIds.push(...colorExistRecords.map(rec => rec.orderId));
      }
      const openOrderInfos = openOrderIds.filter(rec => !colorExistIds.includes(rec.id))
      if (openOrderInfos.length) {
        return new MoListResponse(true, 1, '', openOrderInfos.map(rec => new MoListModel(rec.orderNo, rec.id, rec.styleCode, rec.buyerDesc, rec.plantStyle)));
      } else {
        return new CommonResponse(true, 2, '', []);
      }
    } catch (error) {
      throw error;
    }
  }


  async getOrderInfoByOrderId(req: SewingOrderCreationRequest): Promise<SewingCreationResponse> {
    const sewingRequest = new SewingOrderCreationRequest(req.username, req.unitCode, req.companyCode, req.userId, req.orderId, req?.orderLine, req?.cutSerial, req?.options);
    if (!req?.orderId) {
      throw new ErrorResponse(1039, "Please Provide Order Id");
    }
    const getOrderInfo = await this.orderRepo.findOne({ where: { id: req.orderId } });
    const getOrderLineData = await this.orderLineRepo.getOrderLineInfo(sewingRequest);
    const soLineInfoArray: MoLineInfo[] = [];
    const orderInfo = getOrderInfo.id;
    const deliveryDates = new Set<string>();
    const destinations = new Set<string>();
    const coLines = new Set<string>();
    const buyerPos = new Set<string>();
    const productTypes = new Set<string>();
    const productNames = new Set<string>();
    const garmentVendorPos = new Set<string>();
    const planProductionDates = new Set<string>();
    let orderQty: number = 0;
    for (const orderLineData of getOrderLineData) {
      buyerPos.add(orderLineData.buyer_po);
      deliveryDates.add(orderLineData.planned_cut_date);
      destinations.add(orderLineData.destination);
      coLines.add(orderLineData.co_line);
      productTypes.add(orderLineData.product_sub_type);
      productNames.add(orderLineData.sub_product_name);
      garmentVendorPos.add(orderLineData.garment_vendor_po);
      planProductionDates.add(orderLineData.planned_production_date);
      let soLineInfo: MoLineInfo = null;
      let checkFlag = false;
      const orderLineObj = soLineInfoArray.filter(info => info.moLine === orderLineData.moline);
      if (orderLineObj.length) {
        console.log(orderLineObj);
        const lineObj = orderLineObj.find(info => info.productName === orderLineData.sub_product_name);
        if (lineObj) {
          checkFlag = true;
          soLineInfo = lineObj;
        }
      }
      if (!checkFlag) {
        const newMoLineInfo = new MoLineInfo(orderLineData.moline, orderLineData.cutserial, orderLineData.product_sub_type, orderLineData.sub_product_name, orderLineData.qty, Number(orderLineData.id), null, []);
        soLineInfo = null;
        soLineInfo = newMoLineInfo;
      }
      console.log(orderLineData.planned_cut_date,"lllllllllll")
      orderQty += Number(soLineInfo.quantity);
      const sublineInfoArray: SubLineInfo[] = [];
      const orderLineIds = orderLineData.id.split(',');
      let deliveryDate = orderLineData.delivery_date;
      let destination = orderLineData.destination;
      let plannedCutDate = orderLineData.planned_cut_date;
      let coLine = orderLineData.co_line;
      let buyerPo = orderLineData.buyer_po;
      let productType = orderLineData.product_sub_type;
      let productName = orderLineData.sub_product_name;
      let productCategory = getOrderInfo.productCategory;
      let garmentVendorPo = orderLineData.garment_vendor_po;
      let plannedProductionDate = orderLineData.planned_production_date;
      let subLineWhereObj = [];

      console.log(req.options);

      if (req.options?.length) {
        if (!req.options.includes(SewingCreationOptionsEnum.DELIVERYDATE)) {
          deliveryDate = null;
        } else {
          if (deliveryDate) {
            subLineWhereObj.push({
              [SewingCreationOptionsEnum.DELIVERYDATE]: deliveryDate
            })
          }

        }
        if (!req.options.includes(SewingCreationOptionsEnum.DESTINATION)) {
          destination = null;
        } else {
          if (destination) {
            subLineWhereObj.push({
              [SewingCreationOptionsEnum.DESTINATION]: destination
            })
          }

        }
        // if (!req.options.includes(SewingCreationOptionsEnum.PRODUCTTYPE)) {
        //   productType = null;
        // } else {
        //   if (productType) {
        //     subLineWhereObj.push({
        //       [SewingCreationOptionsEnum.PRODUCTTYPE]: productType
        //     })
        //   }

        // }
        // if (!req.options.includes(SewingCreationOptionsEnum.PRODUCTNAME)) {
        //   productName = null;
        // } else {
        //   if (productName) {
        //     subLineWhereObj.push({
        //       [SewingCreationOptionsEnum.PRODUCTNAME]: productName
        //     })
        //   }

        // }
        // if (!req.options.includes(SewingCreationOptionsEnum.PRODUCTCATEGORY)) {
        //   productCategory = null;
        // } else {
        //   if (productCategory) {
        //     subLineWhereObj.push({
        //       [SewingCreationOptionsEnum.PRODUCTCATEGORY]: productCategory
        //     })
        //   }

        // }
        if (!req.options.includes(SewingCreationOptionsEnum.PRODUCTIONDATE)) {
          plannedProductionDate = null;
        } else {
          if (plannedProductionDate) {
            subLineWhereObj.push({
              [SewingCreationOptionsEnum.PRODUCTIONDATE]: plannedProductionDate
            })
          }
        }
      } else {
        deliveryDate = null;
        destination = null;
        plannedCutDate = null;
        coLine = null;
        buyerPo = null;
        productType = null;
        productName = null;
        productCategory = null;
        garmentVendorPo = null;
        plannedProductionDate = null;
      }
      const sewOrderSubLineIdReq = new SubLineIdsByOrderNoRequest(getOrderInfo.orderNo);
      const sewSublineIds = await this.sewingOrderService.getSewSubLineIdsByOrderNumber(sewOrderSubLineIdReq);
      if (!sewSublineIds.status) {
        throw new ErrorResponse(sewSublineIds.errorCode, sewSublineIds.internalMessage);
      }
      console.log(sewSublineIds);
      const getSubLineData = await this.orderSubLineRepo.getOrderSubLineInfo(orderLineIds, subLineWhereObj, sewSublineIds.data);
      //const getSubLineData = await this.orderSubLineRepo.getOrderSubLineInfo(orderLineIds, subLineWhereObj);
      // TODO: Need to modify this once MO thing is done
      for (const subline of getSubLineData) {
        const sublineInfoData = new SubLineInfo(subline.order_line_no, subline.po_serial, subline.id, subline.color_Desc, subline.size_code, subline.quantity, (subline.delivery_date ? moment(subline.delivery_date).format("YYYY-MM-DD HH:mm") : ''), subline.destination, subline.planned_cut_date, subline.co_line, subline.buyer_po, orderLineData.product_sub_type, orderLineData.sub_product_name, getOrderInfo.productCategory, subline.garment_vendor_po, null, subline.planned_production_date, getOrderInfo.plantStyle, subline.garment_vendor_po, 'M01');

        sublineInfoArray.push(sublineInfoData);
      }
      const featureGroupData = new FeatureGrouping(null, deliveryDate, destination, plannedCutDate, coLine, buyerPo, productType, productName, productCategory, garmentVendorPo, null, sublineInfoArray, plannedProductionDate);
      soLineInfo.featureGrouping.push(featureGroupData);
      soLineInfoArray.push(soLineInfo);
    }
    const sewingCreationOptionsModel = new SewingCreationOptionsModel(req.username, req.unitCode, req.companyCode, req.userId, getOrderInfo.id, getOrderInfo.orderNo, orderQty, getOrderInfo.styleCode, getOrderInfo.refId, getOrderInfo.styleName, '', getOrderInfo.customerCode, getOrderInfo.customerName, Array.from(deliveryDates).join(", "), Array.from(destinations).join(", "), getOrderInfo.plannedCutDate, Array.from(coLines).join(", "), Array.from(buyerPos).join(", "), getOrderInfo.packMethod, Array.from(productTypes).join(", "), Array.from(productNames).join(", "), getOrderInfo.productCategory, Array.from(garmentVendorPos).join(", "), '', soLineInfoArray, null, null, Array.from(planProductionDates).join(", "));

    return new SewingCreationResponse(true, 1040, "Sewing Order Creation Info Successfully Retrieved", [sewingCreationOptionsModel]);
  }


  async getListofMoLines(req: SewingOrderCreationRequest): Promise<MoListResponseData> {
    const orderEntity = new OrderEntity();
    orderEntity.id = req.orderId;
    const orderLineInfo = await this.orderLineRepo.find({ where: { orderId: orderEntity, companyCode: req.companyCode, unitCode: req.unitCode } });
    const soLines = new Set<string>()
    const poSerails = new Set<number>();
    orderLineInfo.map(s => {
      soLines.add(s.orderLineNo);
      poSerails.add(s.poSerial);
    })

    const soLinesList = new MoLines(Array.from(soLines), Array.from(poSerails));
    return new MoListResponseData(true, 1041, "Data retrieved successfully", soLinesList);
  }
  async getOrderInfoByPoSerial(req: PoSerialRequest): Promise<OrderInfoByPoSerailResponse> {
    try {
      const getPoInfo = await this.orderRepo.getOrderInfoByPoSerial(req.poSerial)

      if (getPoInfo.length > 0) {
        const info = []
        for (const rec of getPoInfo) {
          info.push(new OrderInfoByPoSerailModel(rec.product_type, rec.product_name, rec.product_category, rec.plant_style, rec.planned_delivery_date, rec.destination, rec.planned_production_date, rec.planned_cut_date, rec.co_line, rec.buyer_po, rec.garment_vendor_po, rec.oslId))
        }
        return new CommonResponse(true, 1042, 'Data retrieved', info)
      } else {
        return new CommonResponse(false, 924, 'No data found')
      }

    } catch (err) {
      throw err
    }
  }

  /**
   * Service to get order sub line information by taking order line Id
   * @param orderLineRefNo 
   * @param unitCode 
   * @param companyCode 
  */
  async getOrderSubLineInfoByOrderLineId(orderLineRefNo: string, orderRefNo: string, unitCode: string, companyCode: string) {
    console.log(orderLineRefNo, orderRefNo, unitCode, companyCode)
    const orgOrderInfo = await this.orderRepo.findOne({ where: { orderNo: orderRefNo, unitCode, companyCode } });
    if (!orgOrderInfo) {
      throw new ErrorResponse(1044, 'Order info not found for the given order ref no');
    }
    const orderObj = new OrderEntity();
    orderObj.id = orgOrderInfo.id;
    const orderLines = await this.orderLineRepo.find({ where: { orderLineNo: orderLineRefNo, unitCode: unitCode, companyCode: companyCode, orderId: orderObj, isOriginal: false }, relations: ['orderSubLines'] });
    if (!orderLines.length) {
      throw new ErrorResponse(1045, 'Order info no found for the given order Line ref no');
    }
    const info: PoOrderSubLineModel[] = []
    for (const orderLine of orderLines) {
      for (const orderInfo of orderLine.orderSubLines) {
        info.push(new PoOrderSubLineModel(orderLine.plannedDeliveryDate, orderLine.destination, orderLine.plannedProductionDate,
          orderLine.plannedCutDate, orderLine.coLine, orderLine.buyerPo, orderLine.garmentVendorPo, orderLine.productSubType, orderLine.subProductName, orgOrderInfo.productCategory, '', orderLine.colorDesc, orderInfo.sizeDesc, '', orderLineRefNo, orderLine.poSerial, orderInfo.id, orgOrderInfo.plantStyle, orderInfo.id, orderInfo.quantity, null, orderRefNo))
      }
    }
    return new PoSubLineResponse(true, 1046, 'Sub Line Info Retrieved successfully', info)
  }


  /**
   * Service to get order sub line information by taking order line Id
   * @param orderLineRefNo 
   * @param unitCode 
   * @param companyCode 
  */
  async getOrderSubLineInfoByPoSerial(poSerial: number, unitCode: string, companyCode: string) {
    const orderLines = await this.orderLineRepo.find({ where: { poSerial: poSerial, unitCode: unitCode, companyCode: companyCode }, relations: ['orderSubLines', 'orderId'] });
    if (!orderLines.length) {
      throw new ErrorResponse(1047, 'Order info not found for the given po serial');
    }
    const orgOrderInfo = orderLines[0].orderId;
    const info: PoOrderSubLineModel[] = [];
    for (const orderLine of orderLines) {
      for (const orderInfo of orderLine.orderSubLines) {
        info.push(new PoOrderSubLineModel(orderLine.plannedDeliveryDate, orderLine.destination, orderLine.plannedProductionDate,
          orderLine.plannedCutDate, orderLine.coLine, orderLine.buyerPo, orderLine.garmentVendorPo, orderLine.productSubType, orderLine.subProductName, orgOrderInfo.productCategory, '', orderLine.colorDesc, orderInfo.sizeDesc, '', orderLine.orderLineNo, orderLine.poSerial, orderInfo.id, orgOrderInfo.plantStyle, orderInfo.id, orderInfo.quantity, null, orgOrderInfo.orderNo))
      }
    }
    return new PoSubLineResponse(true, 1046, 'Sub Line Info Retrieved successfully', info)
  }


  async getPackOrderInfoByOrderId(req: PackOrderCreationRequest): Promise<PackOrderCreationResponse> {
    const sewingRequest = new PackOrderCreationRequest(req.username, req.unitCode, req.companyCode, req.userId, req.orderId, req?.orderLine, req?.cutSerial, req?.options);
    if (!req?.orderId) {
      throw new ErrorResponse(1039, "Please Provide Order Id");
    }
    const getOrderInfo = await this.orderRepo.findOne({ where: { id: req.orderId } });
    const getOrderLineData = await this.orderLineRepo.getOrderLineInfoForPackOrder(sewingRequest);
    const soLineInfoArray: PackMoLineInfo[] = [];
    const deliveryDates = new Set<string>();
    const destinations = new Set<string>();
    const coLines = new Set<string>();
    const buyerPos = new Set<string>();
    const productTypes = new Set<string>();
    const productNames = new Set<string>();
    const garmentVendorPos = new Set<string>();
    const planProductionDates = new Set<string>();
    const coNos = new Set<string>();
    const buyerNames = new Set<string>();
    const customerNames = new Set<string>();
    let orderQty: number = 0;
    for (const orderLineData of getOrderLineData) {
      orderLineData.buyer_po?.split(',')?.map(r => buyerPos.add(r));
      orderLineData.planned_cut_date?.split(',')?.map(r => deliveryDates.add(r));
      orderLineData.destination?.split(',')?.map(r => destinations.add(r));
      orderLineData.co_line?.split(',')?.map(r => coLines.add(r));
      orderLineData.product_sub_type?.split(',')?.map(r => productTypes.add(r));
      orderLineData.sub_product_name?.split(',')?.map(r => productNames.add(r));
      orderLineData.garment_vendor_po?.split(',')?.map(r => garmentVendorPos.add(r));
      orderLineData.planned_production_date?.split(',')?.map(r => planProductionDates.add(r))
      orderLineData.co_no?.split(',')?.map(r => coNos.add(r));
      orderLineData.buyer_desc?.split(',')?.map(r => buyerNames.add(r));
      orderLineData.customer?.split(',')?.map(r => customerNames.add(r));
      let soLineInfo: PackMoLineInfo = null;
      let checkFlag = false;
      const orderLineObj = soLineInfoArray.filter(info => info.moLine === orderLineData.moline);
      if (orderLineObj.length) {
        const lineObj = orderLineObj.find(info => info.productName === orderLineData.sub_product_name);
        if (lineObj) {
          checkFlag = true;
          soLineInfo = lineObj;
        }
      }
      if (!checkFlag) {
          const newMoLineInfo = new PackMoLineInfo(orderLineData.moline, orderLineData.cutserial, orderLineData.product_sub_type, orderLineData.sub_product_name, orderLineData.qty, Number(orderLineData.id), null, []);
          soLineInfo = null;
          soLineInfo = newMoLineInfo;
      }
      orderQty += Number(soLineInfo.quantity);
      const sublineInfoArray: PackSubLineInfo[] = [];
      const orderLineIds = orderLineData.id.split(',');
      let deliveryDate = orderLineData.delivery_date;
      let destination = orderLineData.destination;
      let plannedCutDate = orderLineData.planned_cut_date;
      let coLine = orderLineData.co_line;
      let buyerPo = orderLineData.buyer_po;
      let productType = orderLineData.product_sub_type;
      let productName = orderLineData.sub_product_name;
      let productCategory = getOrderInfo.productCategory;
      let garmentVendorPo = orderLineData.garment_vendor_po;
      let plannedProductionDate = orderLineData.planned_production_date;
      let subLineWhereObj = [];

      if (req.options?.length) {
        if (!req.options.includes(PackOrderCreationOptionsEnum.DELIVERYDATE)) {
          deliveryDate = null;
        } else {
          if (deliveryDate) {
            subLineWhereObj.push({
              [PackOrderCreationOptionsEnum.DELIVERYDATE]: deliveryDate
            })
          }

        }
        if (!req.options.includes(PackOrderCreationOptionsEnum.DESTINATION)) {
          destination = null;
        } else {
          if (destination) {
            subLineWhereObj.push({
              [PackOrderCreationOptionsEnum.DESTINATION]: destination
            })
          }

        }
        if (!req.options.includes(PackOrderCreationOptionsEnum.CUTDATE)) {
          plannedCutDate = null;
        } else {
          if (plannedCutDate) {
            subLineWhereObj.push({
              [PackOrderCreationOptionsEnum.CUTDATE]: plannedCutDate
            })
          }

        }
        if (!req.options.includes(PackOrderCreationOptionsEnum.COLINE)) {
          coLine = null;
        } else {
          if (coLine) {
            subLineWhereObj.push({
              [PackOrderCreationOptionsEnum.COLINE]: coLine
            })
          }

        }
        if (!req.options.includes(PackOrderCreationOptionsEnum.BUYERPO)) {
          buyerPo = null;
        } else {
          if (buyerPo) {
            subLineWhereObj.push({
              [PackOrderCreationOptionsEnum.BUYERPO]: buyerPo
            })
          }

        }
        if (!req.options.includes(PackOrderCreationOptionsEnum.PRODUCTTYPE)) {
          productType = null;
        } else {
          if (productType) {
            subLineWhereObj.push({
              [PackOrderCreationOptionsEnum.PRODUCTTYPE]: productType
            })
          }

        }
        if (!req.options.includes(PackOrderCreationOptionsEnum.PRODUCTNAME)) {
          productName = null;
        } else {
          if (productName) {
            subLineWhereObj.push({
              [PackOrderCreationOptionsEnum.PRODUCTNAME]: productName
            })
          }

        }
        if (!req.options.includes(PackOrderCreationOptionsEnum.PRODUCTCATEGORY)) {
          productCategory = null;
        } else {
          if (productCategory) {
            subLineWhereObj.push({
              [PackOrderCreationOptionsEnum.PRODUCTCATEGORY]: productCategory
            })
          }

        }
        if (!req.options.includes(PackOrderCreationOptionsEnum.GARMENTVENDORPO)) {
          garmentVendorPo = null;
        } else {
          if (garmentVendorPo) {
            subLineWhereObj.push({
              [PackOrderCreationOptionsEnum.GARMENTVENDORPO]: garmentVendorPo
            })
          }

        }
        if (!req.options.includes(PackOrderCreationOptionsEnum.PRODUCTIONDATE)) {
          plannedProductionDate = null;
        } else {
          if (plannedProductionDate) {
            subLineWhereObj.push({
              [PackOrderCreationOptionsEnum.PRODUCTIONDATE]: plannedProductionDate
            })
          }
        }
      } else {
        deliveryDate = null;
        destination = null;
        plannedCutDate = null;
        coLine = null;
        buyerPo = null;
        productType = null;
        productName = null;
        productCategory = null;
        garmentVendorPo = null;
        plannedProductionDate = null;
      }
      const packOrderSubLineIdReq = new PackSubLineIdsByOrderNoRequest(getOrderInfo.orderNo);
      const sewSublineIds = await this.packingOrderService.getPackSubLineIdsByOrderNumber(packOrderSubLineIdReq);
      if (!sewSublineIds.status) {
        throw new ErrorResponse(sewSublineIds.errorCode, sewSublineIds.internalMessage);
      }
      const getSubLineData = await this.orderSubLineRepo.getOrderSubLineInfo(orderLineIds, subLineWhereObj, sewSublineIds.data);
      //const getSubLineData = await this.orderSubLineRepo.getOrderSubLineInfo(orderLineIds, subLineWhereObj);
      let subLineOrderQtySum = 0;
      for (const subline of getSubLineData) {
        const sublineInfoData = new PackSubLineInfo(subline.order_line_no, subline.po_serial, subline.id, subline.color_Desc, subline.size_code, subline.quantity, (subline.delivery_date ? moment(subline.delivery_date).format("YYYY-MM-DD HH:mm") : ''), subline.destination, subline.planned_cut_date, subline.co_line, subline.buyer_po, orderLineData.product_sub_type, orderLineData.sub_product_name, getOrderInfo.productCategory, subline.garment_vendor_po, null, subline.planned_production_date, getOrderInfo.plantStyle);
        sublineInfoArray.push(sublineInfoData);
        subLineOrderQtySum += Number(subline.quantity);
      }
      const featureGroupData = new PackFeatureGrouping(null, deliveryDate, destination, plannedCutDate, coLine, buyerPo, productType, productName, productCategory, garmentVendorPo, null, sublineInfoArray, plannedProductionDate);
      soLineInfo.featureGrouping.push(featureGroupData);
      soLineInfo.quantity = subLineOrderQtySum.toString();
      if (subLineOrderQtySum !== 0) {
        soLineInfoArray.push(soLineInfo);
      }

    }
    const packOrderCeateModel = new PackOrderCreationModel(req.username, req.unitCode, req.companyCode, req.userId, getOrderInfo.id, getOrderInfo.orderNo, orderQty, getOrderInfo.styleCode, getOrderInfo.refId, getOrderInfo.styleName, '', getOrderInfo.customerCode, getOrderInfo.customerName, Array.from(deliveryDates).toString(), Array.from(destinations).toString(), getOrderInfo.plannedCutDate, Array.from(coLines).toString(), Array.from(buyerPos).toString(), getOrderInfo.packMethod, Array.from(productTypes).toString(), Array.from(productNames).toString(), getOrderInfo.productCategory, Array.from(garmentVendorPos).toString(), '', soLineInfoArray, null, null, Array.from(planProductionDates).toString(), Array.from(coNos).toString(), Array.from(buyerNames).toString(), Array.from(customerNames).toString());
    return new PackOrderCreationResponse(true, 1050, "Pack Order Creation Info Successfully Retrieved", [packOrderCeateModel]);
  }
  // utilized by PTS
  async getOrderSubLineInfoByOrderSubLineId(req: OslRefIdRequest): Promise<OslIdInfoResponse> {
    const oslRec = await this.orderSubLineRepo.find({where: {companyCode: req.companyCode, unitCode: req.unitCode, id: In(req.oslRefId)}});
    if(!oslRec) {
      throw new ErrorResponse(0, 'Order sub line ids does not exist');
    }
    const oslModels: OslIdInfoModel[] = [];
    const oslInfo = await this.orderSubLineRepo.getOrderSubLineInfoForOslIds(req.oslRefId, req.companyCode, req.unitCode);
    oslInfo.forEach(r => {
      const m = new OslIdInfoModel();
      m.buyerPo = r.buyer_po;
      m.co = r.co_line;
      m.color = r.color_Desc;
      m.delDate = r.delivery_date.toString();
      m.destination = r.destination;
      m.moNumber = '';
      m.oslId = r.id;
      m.pcd = r.planned_cut_date;
      m.productName = r.product_name;
      m.size = r.size_code;
      m.moLineNo =r.order_line_no;
      m.moNo = r.mo_number;
      m.style = r.style;
      m.vpo = r.garment_vendor_po;

      oslModels.push(m);
    })
    return new OslIdInfoResponse(true, 0, 'OSL info retrieved', oslModels);
  }
}
