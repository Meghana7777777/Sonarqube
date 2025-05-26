import { Injectable } from "@nestjs/common"; import { DataSource, Not } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import moment = require("moment");
import { OrderManipulationHelperService } from "./order-manipulation-helper.service";
import { OrderRepository } from "../common/repository/order.repository";
import { OrderLineOpRepository } from "../common/repository/order-line-op.repository";
import { OrderSubLineRepository } from "../common/repository/order-sub-line.repository";
import { OrderLineRmRepository } from "../common/repository/order-line-rm.repository";
import { OrderLineOpRmRepository } from "../common/repository/order-line-op-rm.repository";
import { OrderSubLineRmRepository } from "../common/repository/order-sub-line-rm.repository";
import { CommonResponse, CreatePlanningDateRequest, GlobalResponseObject, OrderQtyUpdateModel, RawOrderLineBreakdownRequest, RawOrderLinePoSerialRequest, RawOrderLinesProdTypeSkuMapRequest, RawOrderNoRequest, RawOrderSizesRequest, MoStatusEnum } from "@xpparel/shared-models";
import { OrderInfoService } from "./order-info.service";
import { ErrorResponse } from "@xpparel/backend-utils";
import { OrderSizesRepository } from "../common/repository/order-sizes.repository";
import { OrderEntity } from "../common/entity/order.entity";
import { OrderSizesEntity } from "../common/entity/order-sizes.entity";
import { OrderLineEntity } from "../common/entity/order-line.entity";
import { OrderLineRmEntity } from "../common/entity/order-line-rm.entity";
import { OrderSubLineEntity } from "../common/entity/order-sub-line.entity";
import { OrderPackMethodRepository } from "../common/repository/order-pack-method.repository";
import { OrderPackMethodEntity } from "../common/entity/order-pack-method.entity";
import { OrderLineRepository } from "../common/repository/order-line.repository";
import { LogRevisedOrderLineEntity } from "../common/entity/log-revised-qty-order-lines.entity";

@Injectable()
export class OrderManipulationService {
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
    private orderInfoService: OrderInfoService,
    private orderSizesRepo: OrderSizesRepository,
    private orderPackMethodRepo: OrderPackMethodRepository,
  ) {

  }

  /**
   * Service to save Sub order sizes and pack method
   * @param req 
   * @returns 
  */
  async saveSoSizes(req: RawOrderSizesRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      // check order line is exists or  not
      const unitCode = req.unitCode;
      const companyCode = req.companyCode;
      // getting order details by order no
      const orderDetails = await this.orderInfoService.getOrderDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (!orderDetails) {
        throw new ErrorResponse(1081, 'Order no not exists. Please check and try again!!!');
      }
      // if order is already confirmed user is not allowed to the changes
      if (orderDetails.isConfirmed) {
        throw new ErrorResponse(1082, 'Order is already confirmed. You are not allowed to do the changes.');
      }
      // Order should not have sub lines to proceed 
      const orderSubLineDetails = await this.orderInfoService.getOrderSubLineDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (orderSubLineDetails.length) {
        throw new ErrorResponse(1083, 'Color quantity is already updated . Please delete and proceed again')
      }
      if (!req.orderPlantStyle) {
        throw new ErrorResponse(1084, 'Plant style is not provided');
      }
      // check if the plant style exist for any of the order in the unit. If this is an update request for the same order then we should discard that 
      const planStyleRefRecordExist = await this.orderRepo.findOne({ select: ['orderNo'], where: { unitCode: unitCode, companyCode: companyCode, plantStyle: req.orderPlantStyle, isActive: true, id: Not(req.orderId) } });
      if (planStyleRefRecordExist) {
        throw new ErrorResponse(1085, `Plant style ${req.orderPlantStyle} is already mapped to SO: ${planStyleRefRecordExist.orderNo}`);
      }
      await manager.startTransaction();
      await manager.getRepository(OrderEntity).update({ id: req.orderId, unitCode, companyCode }, { soProgressStatus: MoStatusEnum.IN_PROGRESS, productType: 'SAMPLE', plantStyle: req.orderPlantStyle });
      await manager.getRepository(OrderSizesEntity).delete({ orderId: req.orderId, unitCode, companyCode });
      for (const eachSize of req.sizes) {
        const orderSize = new OrderSizesEntity();
        orderSize.orderId = req.orderId;
        orderSize.companyCode = companyCode;
        orderSize.createdUser = req.username;
        orderSize.orderId = req.orderId;
        orderSize.size = eachSize;
        orderSize.unitCode = unitCode;
        await manager.getRepository(OrderSizesEntity).save(orderSize);
      }
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 1086, 'Order sizes has been updated successfully!!!');
    } catch (error) {
      await manager.releaseTransaction();
      throw error;
    }
  }

  /**
   * Service to delete So related sizes and pack method
   * @param req 
   * @returns 
  */
  async deleteSoSizes(req: RawOrderNoRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      const unitCode = req.unitCode;
      const companyCode = req.companyCode;
      // validating order has been confirmed or not
      // getting order details by order no
      const orderDetails = await this.orderInfoService.getOrderDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (!orderDetails) {
        throw new ErrorResponse(1081, 'Order no not exists. Please check and try again!!!');
      }
      // if order is already confirmed user is not allowed to the changes
      if (orderDetails.isConfirmed) {
        throw new ErrorResponse(1082, 'Order is already confirmed. You are not allowed to do the changes.');
      }
      // Order should not have sub lines to proceed 
      const orderSubLineDetails = await this.orderInfoService.getOrderSubLineDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (orderSubLineDetails.length) {
        throw new ErrorResponse(1083, 'Color quantity is already updated . Please delete and proceed again')
      }
      await manager.startTransaction();
      await manager.getRepository(OrderEntity).update({ id: req.orderId, unitCode, companyCode }, { soProgressStatus: MoStatusEnum.IN_PROGRESS })
      await manager.getRepository(OrderSizesEntity).delete({ orderId: req.orderId, companyCode: companyCode, unitCode: unitCode });
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 1090, 'So Sizes deleted successfully!!!');
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }

  /**
   * 
   * service to save the product type
   * @param req 
   * @returns 
  */
  async saveSoProductTypeRmSkuMapping(req: RawOrderLinesProdTypeSkuMapRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const unitCode = req.unitCode;
      const companyCode = req.companyCode;
      const orderDetails = await this.orderInfoService.getOrderDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (!orderDetails) {
        throw new ErrorResponse(1081, 'Order no not exists. Please check and try again!!!');
      }

      const orderLineDetails = await this.orderInfoService.getOrderLineDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (!orderLineDetails) {
        throw new ErrorResponse(1092, 'Order line details not found. Please check');
      }

      // Order should not have sub lines to proceed 
      const orderSubLineDetails = await this.orderInfoService.getOrderSubLineDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (orderSubLineDetails.length) {
        throw new ErrorResponse(1083, 'Color quantity is already updated . Please delete and proceed again')
      }

      // if not saved, then save the pack method entities as well as duplicate lines
      const packConfigEnts: OrderPackMethodEntity[] = [];
      req.rawOrderProductTypeSkuMap.forEach(item => {
        const pmEnt = new OrderPackMethodEntity();
        pmEnt.createdUser = req.username;
        pmEnt.companyCode = companyCode;
        pmEnt.unitCode = unitCode;
        pmEnt.productName = item.productName;
        pmEnt.productType = item.prodType;
        pmEnt.orderId = req.orderId;
        if (item.iCode.length == 0) {
          throw new ErrorResponse(1094, 'RM must be attached to all the products');
        }
        pmEnt.iCodes = item.iCode?.toString();
        packConfigEnts.push(pmEnt);
      });

      await transManager.startTransaction();
      await transManager.getRepository(OrderEntity).update({ id: req.orderId, companyCode: req.companyCode, unitCode: req.unitCode }, { packMethod: req.packMethod });
      await transManager.getRepository(OrderPackMethodEntity).delete({ orderId: req.orderId });
      await transManager.getRepository(OrderPackMethodEntity).save(packConfigEnts, { reload: false });
      await transManager.completeTransaction();

      return new GlobalResponseObject(true, 1095, 'SO product type SKU mapping successfully completed.');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * confirm the pack method configs for the SO. Once confirmed, we have to create the duplicated lines and RM
   * @param req 
   * @returns 
   */
  async confirmSoProductTypeRmSkuMapping(req: RawOrderNoRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      // check if the so pack method mapping is already confirmed
      const orderEnt = new OrderEntity();
      orderEnt.id = req.orderId;
      const lines = await this.orderLineRepo.find({ select: ['id'], where: { orderId: orderEnt, companyCode: req.companyCode, unitCode: req.unitCode, isOriginal: false } });
      if (lines.length > 0) {
        throw new ErrorResponse(1096, 'SO is already confirmed')
      }

      await transManager.startTransaction();
      const packMethodConfig: OrderPackMethodEntity[] = await this.orderPackMethodRepo.find({ where: { orderId: req.orderId, companyCode: req.companyCode, unitCode: req.unitCode } });
      if (packMethodConfig.length == 0) {
        throw new ErrorResponse(1097, 'Pack method config is not saved for the SO');
      }
      const rmForOrderLine = await this.orderInfoService.getOrderRmSkuMappingByOrderId(req.orderId, req.unitCode, req.companyCode)
      for (const pmRec of packMethodConfig) {
        const orderLineDetails = await this.orderInfoService.getOrderLineDetailsByOrderId(req.orderId, req.unitCode, req.companyCode);
        // now create the lines and its respective RM based on the pack method items selection
        for (const orderLine of orderLineDetails) {
          const olId = orderLine.id;
          // unset the id and the created at
          orderLine.id = undefined;
          orderLine.createdAt = undefined;
          orderLine.createdUser = req.username;
          orderLine.subProductName = pmRec.productName;
          orderLine.productSubType = pmRec.productType;
          orderLine.isOriginal = false;
          orderLine.orderId = new OrderEntity();
          orderLine.orderId.id = req.orderId;
          // save the line and get the id
          const savedDuplicatedLine = await transManager.getRepository(OrderLineEntity).save(orderLine);
          for (const eachRm of pmRec.iCodes.split(',')) {
            const rm = rmForOrderLine.find(rmInfo => rmInfo.itemCode == eachRm);
            if (rm) {
              rm.id = undefined;
              rm.createdAt = undefined;
              rm.createdUser = req.username;
              rm.orderLineId = new OrderLineEntity();
              rm.orderLineId.id = savedDuplicatedLine.id;
              rm.isOriginal = false;
              // save the order line RM entity
              await transManager.getRepository(OrderLineRmEntity).save(rm, { reload: false });
            }
          }
        }
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 1098, 'SO pack method successfully confirmed');
    } catch (err) {
      console.log(err)
      throw err;
    }
  }

  /**
   * When deleted, we have to delete all the RM mapping of the 
   * Service to delete SO Product type and RM SKU mapping
   * @param req 
   * @returns 
  */
  async deleteSOProductTypeRmSkuMapping(req: RawOrderNoRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      const unitCode = req.unitCode;
      const companyCode = req.companyCode;
      const orderDetails = await this.orderInfoService.getOrderDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (!orderDetails) {
        throw new ErrorResponse(1081, 'Order no not exists. Please check and try again!!!');
      }
      // if order is already confirmed user is not allowed to the changes
      if (orderDetails.isConfirmed) {
        throw new ErrorResponse(1082, 'Order is already confirmed. You are not allowed to do the changes.');
      }
      // Order should not have sub lines to proceed 
      const orderSubLineDetails = await this.orderInfoService.getOrderSubLineDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (orderSubLineDetails.length) {
        throw new ErrorResponse(1083, 'Color quantity is already updated . Please delete and proceed again')
      }
      // delete the product type for the so lines as well as the RM skus for each so line
      await manager.startTransaction();
      const orderEnt = new OrderEntity();
      orderEnt.id = req.orderId;
      await manager.getRepository(OrderEntity).update({ id: req.orderId, companyCode: req.companyCode, unitCode: req.unitCode }, { packMethod: null });
      await manager.getRepository(OrderLineRmEntity).delete({ orderId: req.orderId, companyCode: companyCode, unitCode: unitCode, isOriginal: false });
      await manager.getRepository(OrderLineEntity).delete({ orderId: orderEnt, companyCode: companyCode, unitCode: unitCode, isOriginal: false });
      await manager.getRepository(OrderPackMethodEntity).delete({ orderId: req.orderId, companyCode: companyCode, unitCode: unitCode });
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 1102, 'SO product type and RM SKU mapping has been deleted successfully');
    } catch (error) {
      await manager.releaseTransaction();
      throw error;
    }
  }

  /**
   *  saves the line level size breakdown for the so lines plus color of the line
   * @param req 
   * @returns 
   */
  async saveSoSizeQtysBreakdown(req: RawOrderLineBreakdownRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      const unitCode = req.unitCode;
      const companyCode = req.companyCode;
      const orderDetails = await this.orderInfoService.getOrderDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (!orderDetails) {
        throw new ErrorResponse(1081, 'Order no not exists. Please check and try again!!!');
      }
      // if order is already confirmed user is not allowed to the changes
      if (orderDetails.isConfirmed) {
        throw new ErrorResponse(1082, 'Order is already confirmed. You are not allowed to do the changes.');
      }
      // Order should not have sub lines to proceed 
      const orderSubLineDetails = await this.orderInfoService.getOrderSubLineDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (orderSubLineDetails.length) {
        throw new ErrorResponse(1083, 'Color quantity is already updated . Please delete and proceed again')
      }
      for (const eachOrderLIne of req.oslbreakdown) {
        const orderLineDetails = await this.orderInfoService.getOrderLineDetailsByOrderLineId(eachOrderLIne.orderLineId, unitCode, companyCode);
        if (!orderLineDetails) {
          throw new ErrorResponse(1092, 'Order line details not found. Please check');
        }
      }
      await manager.startTransaction();
      for (const eachOrderLIne of req.oslbreakdown) {
        // Need to update the color here
        const orderSize: OrderSubLineEntity[] = [];
        await manager.getRepository(OrderLineEntity).update({ id: eachOrderLIne.orderLineId, unitCode, companyCode, isOriginal: false }, { colorCode: eachOrderLIne.color, colorDesc: eachOrderLIne.color });
        for (const eachSizeBreak of eachOrderLIne.orderLineBreakdown) {
          const orderSizeEntity = new OrderSubLineEntity();
          orderSizeEntity.colorDesc = eachSizeBreak.color;
          orderSizeEntity.unitCode = unitCode;
          orderSizeEntity.companyCode = companyCode;
          orderSizeEntity.createdUser = req.username;
          orderSizeEntity.deliveryDate = null;
          orderSizeEntity.eRefNo = null;
          orderSizeEntity.iRefNo = null;
          orderSizeEntity.isPlanned = false;
          orderSizeEntity.orderId = req.orderId;
          const orderLineObj = new OrderLineEntity();
          orderLineObj.id = eachOrderLIne.orderLineId;
          orderSizeEntity.orderLineId = orderLineObj;
          orderSizeEntity.quantity = eachSizeBreak.quantity;
          orderSizeEntity.sizeCode = eachSizeBreak.size;
          orderSizeEntity.sizeDesc = eachSizeBreak.size;
          orderSizeEntity.startDate = null;
          orderSize.push(orderSizeEntity);
        }
        await manager.getRepository(OrderSubLineEntity).save(orderSize, { reload: false });
      }
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 1107, 'SO Size quantities saved successfully!!!');
    } catch (error) {
      await manager.releaseTransaction();
      throw error;
    }
  }

  /**
   *  deletes the line level size breadown for the so lines
   * @param req 
   * @returns 
   */
  async deleteSoSizeQtysBreakdown(req: RawOrderNoRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const unitCode = req.unitCode;
      const companyCode = req.companyCode;
      const orderDetails = await this.orderInfoService.getOrderDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (!orderDetails) {
        throw new ErrorResponse(1081, 'Order no not exists. Please check and try again!!!');
      }
      // if order is already confirmed user is not allowed to the changes
      if (orderDetails.isConfirmed) {
        throw new ErrorResponse(1082, 'Order is already confirmed. You are not allowed to do the changes.');
      }
      const orderSubLineDetails = await this.orderInfoService.getOrderSubLineDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (!orderSubLineDetails.length) {
        throw new ErrorResponse(1110, 'Color quantity is not yet updated . Please update and proceed again')
      }
      const orderEnt = new OrderEntity();
      orderEnt.id = req.orderId;
      await transManager.startTransaction();
      await transManager.getRepository(OrderSubLineEntity).delete({ orderId: req.orderId, unitCode, companyCode });
      await transManager.getRepository(OrderLineEntity).update({ orderId: orderEnt, unitCode, companyCode, isOriginal: false }, { colorCode: '', colorDesc: '' });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 1111, 'SO sizes has been deleted successfully!!!');
    } catch (error) {
      await transManager.releaseTransaction()
      throw error;
    }
  }

  /**
   * once after the confirmation, we have to save the product and sub product
   * @param req 
   * @returns 
  */
  async confirmSo(req: RawOrderNoRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const unitCode = req.unitCode;
      const companyCode = req.companyCode;
      const orderDetails = await this.orderInfoService.getOrderDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (!orderDetails) {
        throw new ErrorResponse(1081, 'Order no not exists. Please check and try again!!!');
      }
      // if order is already confirmed user is not allowed to the changes
      if (orderDetails.isConfirmed) {
        throw new ErrorResponse(1082, 'Order is already confirmed. You are not allowed to do the changes.');
      }
      const rmSkuMapDetails: OrderLineRmEntity[] = await this.orderInfoService.getOrderRmSkuMappingByOrderId(req.orderId, unitCode, companyCode);
      const rmSkuNotOriginalDetails = rmSkuMapDetails.filter(sku => sku.isOriginal == true);
      if (rmSkuNotOriginalDetails.length) {
        throw new ErrorResponse(1114, 'Rm sku mapping is not yet completed. Please do SKU mapping before confirming the order.')
      }
      const orderSizes = await this.orderInfoService.getOrderSizesByOrderId(req.orderId, unitCode, companyCode);
      if (!orderSizes.length) {
        throw new ErrorResponse(1115, 'Order sizes are not yet mapped , Please do size mapping before confirming.')
      }
      if (!orderDetails.packMethod) {
        throw new ErrorResponse(1116, 'Pack method not yet attached to the order. Please attach and confirm the order')
      }
      await transManager.startTransaction();
      await transManager.getRepository(OrderEntity).update({ id: req.orderId, unitCode, companyCode }, { isConfirmed: true, updatedUser: req.username });
      await this.orderManipulationHelper.saveProductAndSubProduct(req, transManager);
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 1117, 'Order Confirmed successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * validations to be in place, once after the de-confirmation, we have to delete the product and sub product
   * @param req 
   * @returns 
   */
  async unConfirmSo(req: RawOrderNoRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const unitCode = req.unitCode;
      const companyCode = req.companyCode;
      const orderDetails = await this.orderInfoService.getOrderDetailsByOrderId(req.orderId, unitCode, companyCode);
      if (!orderDetails) {
        throw new ErrorResponse(1081, 'Order no not exists. Please check and try again!!!');
      }
      // if order is already confirmed user is not allowed to the changes
      if (!orderDetails.isConfirmed) {
        throw new ErrorResponse(1119, 'Order is not yet confirmed.');
      }
      await transManager.startTransaction();
      await transManager.getRepository(OrderEntity).update({ id: req.orderId, unitCode, companyCode }, { isConfirmed: false });
      await this.orderManipulationHelper.deleteProductAndSubProduct(req, transManager);
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 1120, 'Order UN Confirmed successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * Service to update PO serial for the order line
   * @param req 
   * @returns 
  */
  async updatePoSerialForOrderLine(req: RawOrderLinePoSerialRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    console.log(req, '1');
    try {
      for (const orderLineId of req.orderLineIds) {
        const poLineDetail: OrderLineEntity = await this.orderLineRepo.findOne({ select: ['poSerial'], where: { id: orderLineId, unitCode: req.unitCode, companyCode: req.companyCode } });
        if (Number(poLineDetail?.poSerial) !== 0 && req.poSerial) {
          throw new ErrorResponse(1121, `PO Serial is already updated for the given Order Line ${orderLineId}`)
        }
      }
      console.log(req, '2');
      await manager.startTransaction();
      for (const eachOrderLine of req.orderLineIds) {
        req.poSerial ? await manager.getRepository(OrderLineEntity).update({ unitCode: req.unitCode, companyCode: req.companyCode, id: eachOrderLine }, { poSerial: req.poSerial }) : await manager.getRepository(OrderLineEntity).update({ unitCode: req.unitCode, companyCode: req.companyCode, id: eachOrderLine }, { poSerial: 0 });
      }

      await manager.completeTransaction();
      return new GlobalResponseObject(true, 1122, 'Po serial Updated for the Order line successfully');
    } catch (err) {
      console.log(err)
      await manager.releaseTransaction();
      throw err;
    }
  }

  //update the Planned Cut Date against each open SO
  async savePlannedCutDate(req: CreatePlanningDateRequest): Promise<GlobalResponseObject> {
    try {
      if (!req.orderId) {
        throw new Error(`Order with ID ${req.orderId} not found.`);
      }
      const order = await this.orderRepo.findOne({
        where: { id: req.orderId, unitCode: req.unitCode, companyCode: req.companyCode },
      });
      if (!order) {
        throw new Error(`Order with ID ${req.orderId} not found.`);
      }
      const planStyleRefRecordExist = await this.orderRepo.findOne({ select: ['orderNo'], where: { unitCode: req.unitCode, companyCode: req.companyCode, plantStyle: req.plantStyle, isActive: true, id: Not(req.orderId) } });
      if (planStyleRefRecordExist) {
        throw new ErrorResponse(1123, `Plant style ${req.plantStyle} is already mapped to SO: ${planStyleRefRecordExist.orderNo}`);
      }
      await this.orderRepo.update(
        { id: req.orderId, unitCode: req.unitCode, companyCode: req.companyCode },
        { plantStyle: req.plantStyle, plannedCutDate: req.plannedCutDate }
      );
      return new GlobalResponseObject(true, 1124, 'saved successfully')
    } catch (error) {
      throw new Error(`Error saving planned cut date: ${error.message}`);
    }
  }

  //Delete the Planned Cut Date against each open SO
  async deletePlannedCutDate(req: CreatePlanningDateRequest): Promise<GlobalResponseObject> {
    try {
      const order = await this.orderRepo.findOne({
        where: { id: req.orderId, unitCode: req.unitCode, companyCode: req.companyCode },
      });
      if (!order) {
        throw new Error(`Order with ID ${req.orderId} not found.`);
      }

      await this.orderRepo.update(
        { id: req.orderId, unitCode: req.unitCode, companyCode: req.companyCode },
        { plantStyle: null, plannedCutDate: null }
      );

      return new GlobalResponseObject(true, 1125, 'Deleted plantStyle and plannedCutDate successfully');
    } catch (error) {
      throw new Error(`Error deleting plantStyle and planned cut date: ${error.message}`);
    }
  }
  
  async updateOrderQtyRevision(req: OrderQtyUpdateModel): Promise<CommonResponse> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      const { unitCode, companyCode } = req;
      const poSubLineCount: number = await this.orderSubLineRepo.count({ where: { unitCode, companyCode, orderId: req.orderIdPk } });
      if (poSubLineCount) {
        throw new ErrorResponse(1126, `Color wise quantities already updated`)
      }
      await manager.startTransaction();
      const logEntities = [];
      const orderLines = [];
      let totalQty = 0;
      for (const eachOrderLine of req.orderLines) {
        if (eachOrderLine.revisedQuantity) {
          const logEntity = new LogRevisedOrderLineEntity();
          logEntity.orderId = req.orderIdPk;
          logEntity.orderLineId = eachOrderLine.orderLineId;
          logEntity.orderLineNo = eachOrderLine.orderLineNo;
          logEntity.quantity = eachOrderLine.quantity;
          logEntity.revisedQty = eachOrderLine.revisedQuantity;
          logEntity.companyCode = req.companyCode;
          logEntity.unitCode = req.unitCode;
          logEntity.createdUser = req.username;
          logEntities.push(logEntity);

          const ol = new OrderLineEntity();
          ol.id = eachOrderLine.orderLineId;
          ol.quantity = eachOrderLine.revisedQuantity;
          orderLines.push(ol);
          totalQty += eachOrderLine.revisedQuantity
        } else {
          totalQty += eachOrderLine.quantity
        }
      }
      await manager.getRepository(LogRevisedOrderLineEntity).save(logEntities);
      await manager.getRepository(OrderLineEntity).save(orderLines);
      await manager.getRepository(OrderEntity).update({ id: req.orderIdPk }, { quantity: totalQty });
      await this.orderManipulationHelper.updateOrderQtyRevisionWms(req);
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 1127, 'Quantity updated successfully');
    } catch (error) {
      await manager.releaseTransaction();
      throw error;
    }
  }
}