// import { Injectable } from "@nestjs/common";
// import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, OrderNoRequest, PhItemCategoryEnum, ManufacturingOrderDumpRequest, ManufacturingOrderListRequest, ManufacturingOrderNumberRequest, MoStatusEnum } from "@xpparel/shared-models";
// import { PreIntegrationService } from "@xpparel/shared-services";
// import { DataSource } from "typeorm";
// import { GenericTransactionManager } from "../../database/typeorm-transactions";
// import { OrderLineRmEntity } from "../common/entity/order-line-rm.entity";
// import { OrderLineEntity } from "../common/entity/order-line.entity";
// import { OrderEntity } from "../common/entity/order.entity";
// import moment = require("moment");
// import { OrderListEntity } from "../common/entity/order-list.entity";
// import { OrderListRepository } from "../common/repository/order-list.repository";
// import { OrderRepository } from "../common/repository/order.repository";
// import { ErrorResponse } from "@xpparel/backend-utils";
// import { OrderCreationLogEntity } from "../common/entity/order-creation-log.entity";
// import { OrderCreationLogRepository } from "../common/repository/order-creation-log.repository";
// import { OrderWithSelectedFieldsResponse } from "../common/repository/query-response/order-and-order-line-query.response";
// import { SoInfoRepository } from "../common/repository/so-info.repository";
// import { SoInfoEntity } from "../common/entity/so-info.entity";

// @Injectable()
// export class PreIntegrationServiceOms {
//   constructor(
//     private dataSource: DataSource,
//     private preIntegrationWms: PreIntegrationService,
//     private orderListRepo: OrderListRepository,
//     private orderRepo: OrderRepository,
//     private orderErrorRepo: OrderCreationLogRepository,
//     private soInfoRepo: SoInfoRepository,
//   ) {
//   }

//   async saveManufacturingOrderInformation(req: ManufacturingOrderNumberRequest): Promise<any> {
//     const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
//     try {
//       const manufacturingOrderData = await this.preIntegrationWms.getManufacturingorderInformation(req);
//       await transactionalEntityManager.startTransaction();
//       if (manufacturingOrderData) {
//         const existingRecord = await this.orderRepo.findOne({
//           where: {
//             orderNo: manufacturingOrderData.data.basicManufacturingOrderDetails.manufacturingOrder,
//             companyCode: req.companyCode,
//             unitCode: req.unitCode
//           }
//         });
//         if (existingRecord) {
//           throw new ErrorResponse(1051, 'This Manufacturing Order Information already exists.');
//         }
//         const orders = new OrderEntity();
//         orders.orderNo = manufacturingOrderData.data.basicManufacturingOrderDetails.manufacturingOrder;
//         orders.refId = manufacturingOrderData.data.basicManufacturingOrderDetails.manufacturingOrderId;
//         orders.co = manufacturingOrderData.data.basicManufacturingOrderDetails.manufacturingOrder;
//         orders.coDesc = '';
//         orders.buyerDesc = manufacturingOrderData.data.basicManufacturingOrderDetails.customerName;
//         orders.buyerLocation = manufacturingOrderData.data.basicManufacturingOrderDetails.customerCode;
//         orders.quantity = manufacturingOrderData.data.basicManufacturingOrderDetails.quantity;
//         orders.customerCode = manufacturingOrderData.data.basicManufacturingOrderDetails.customerCode;
//         orders.customerName = manufacturingOrderData.data.basicManufacturingOrderDetails.customerName;
//         orders.profitCenterCode = manufacturingOrderData.data.basicManufacturingOrderDetails.profitCenterCode;
//         orders.profitCenterName = manufacturingOrderData.data.basicManufacturingOrderDetails.profitCenterName;
//         orders.productName = manufacturingOrderData.data.basicManufacturingOrderDetails.productName;
//         orders.productCategory = manufacturingOrderData.data.basicManufacturingOrderDetails.productCategory;
//         orders.styleName = manufacturingOrderData.data.basicManufacturingOrderDetails.styleName;
//         orders.styleCode = manufacturingOrderData.data.basicManufacturingOrderDetails.styleCode;
//         orders.styleDesc = manufacturingOrderData.data.basicManufacturingOrderDetails.styleDesc;
//         orders.companyCode = req.companyCode;
//         orders.unitCode = req.unitCode;
//         orders.createdUser = req.username;
//         orders.soProgressStatus = MoStatusEnum.OPEN;
//         const saveOrderResponse = await transactionalEntityManager.getRepository(OrderEntity).save(orders);
//         for (const manufacturingOrderItem of manufacturingOrderData.data.manufacturingOrderItems) {
//           const orderLine = new OrderLineEntity();
//           orderLine.styleName = manufacturingOrderItem.styleName;
//           orderLine.styleCode = manufacturingOrderItem.styleCode;
//           orderLine.styleDesc = manufacturingOrderItem.styleDesc;
//           orderLine.orderId = saveOrderResponse;
//           orderLine.orderLineNo = manufacturingOrderItem.manufacturingOrderItemNo;
//           orderLine.coLine = manufacturingOrderItem.manufacturingOrderItemNo;
//           orderLine.quantity = manufacturingOrderItem.quantity;
//           orderLine.buyerPo = manufacturingOrderItem.buyerPo;
//           orderLine.eRefNo = manufacturingOrderItem.manufacturingOrderItemNo;
//           orderLine.garmentVendorCode = manufacturingOrderItem.garmentVendorCode;
//           orderLine.garmentVendorName = manufacturingOrderItem.garmentVendorName;
//           orderLine.garmentVendorUnit = manufacturingOrderItem.garmentVendorUnit;
//           orderLine.garmentVendorPo = manufacturingOrderItem.garmentVendorPo;
//           orderLine.garmentVendorPoItem = manufacturingOrderItem.garmentVendorPoItem;
//           orderLine.companyCode = req.companyCode;
//           orderLine.unitCode = req.unitCode;
//           orderLine.createdUser = req.username;
//           orderLine.colorDesc = 'NA';
//           orderLine.colorCode = 'NA';
//           orderLine.poSerial = 0;
//           orderLine.plannedCutDate = manufacturingOrderItem.plannedCutDate;
//           orderLine.plannedProductionDate = manufacturingOrderItem.plannedProductionDate;
//           orderLine.plannedDeliveryDate = manufacturingOrderItem.plannedDeliveryDate;
//           // orderLine.OrderLineRmEntity = [];
//           const saveOrderLineResponse = await transactionalEntityManager.getRepository(OrderLineEntity).save(orderLine);
//           const filteredItemsFabric = manufacturingOrderData.data.manufacturingOrderItemsData.filter(item => item.manufacturingOrderItemNo === manufacturingOrderItem.manufacturingOrderItemNo);
//           for (const fabricInfo of filteredItemsFabric) {
//             const orderLineFabric = new OrderLineRmEntity();
//             orderLineFabric.itemCode = fabricInfo.itemCode;
//             orderLineFabric.itemName = fabricInfo.itemName;
//             orderLineFabric.itemColor = fabricInfo.itemColor;
//             orderLineFabric.itemDesc = fabricInfo.itemDescription;
//             orderLineFabric.itemCode = fabricInfo.itemCode;
//             orderLineFabric.orderLineId = saveOrderLineResponse;
//             orderLineFabric.orderId = saveOrderResponse.id;
//             orderLineFabric.itemType = PhItemCategoryEnum.FAB;
//             orderLineFabric.itemUom = fabricInfo.itemUom;
//             orderLineFabric.supplierCode = fabricInfo.supplierCode;
//             orderLineFabric.supplierName = fabricInfo.supplierName;
//             orderLineFabric.itemConsumption = 0;
//             orderLineFabric.companyCode = req.companyCode;
//             orderLineFabric.unitCode = req.unitCode;
//             orderLineFabric.createdUser = req.username;
//             orderLineFabric.fabricMeters = fabricInfo.fabricMeters;
//             const saveOrderLineRmResponse = await transactionalEntityManager.getRepository(OrderLineRmEntity).save(orderLineFabric);
//           }
//         }
//         await this.orderListRepo.update({ companyCode: req.companyCode, unitCode: req.unitCode, manufacturingOrderNo: manufacturingOrderData.data.basicManufacturingOrderDetails.manufacturingOrder }, { status: MoStatusEnum.DONWLOADED, updatedUser: req.username });
//       }
//       await transactionalEntityManager.completeTransaction();
//       return new GlobalResponseObject(true, 1052, 'Manufacturing Order Information Saved Succussfully.');
//     } catch (error) {
//       await transactionalEntityManager.releaseTransaction();
//       throw error;
//     }
//   }

//   // // Will be called when we upload the order details into the WMS
//   // async saveManufacturingOrderListInformation(req: ManufacturingOrderListRequest): Promise<any> {
//   //   const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
//   //   try {
//   //     // console.log('--called to create manufacturingordercode');
//   //     // console.log(req.manufacturingOrderList);
//   //     await transactionalEntityManager.startTransaction();
//   //     for (const manufacturingOrderNumber of req.manufacturingOrderList) {
//   //       const orderListData = new OrderListEntity();
//   //       orderListData.manufacturingOrderNo = manufacturingOrderNumber;
//   //       orderListData.companyCode = req.companyCode;
//   //       orderListData.unitCode = req.unitCode;
//   //       orderListData.createdUser = req.username;
//   //       orderListData.status = 0;
//   //       // Check if a record with the same manufacturing order number, company code, and unit code already exists
//   //       const existingRecord = await transactionalEntityManager.getRepository(OrderListEntity).findOne({
//   //         where: {
//   //           manufacturingOrderNo: manufacturingOrderNumber,
//   //           companyCode: req.companyCode,
//   //           unitCode: req.unitCode
//   //         }
//   //       });

//   //       if (existingRecord) {
//   //         continue;
//   //       }
//   //       // If no existing record, save the new orderListData
//   //       await transactionalEntityManager.getRepository(OrderListEntity).save(orderListData);
//   //       await transactionalEntityManager.completeTransaction();
//   //     }
//   //     // console.log('--called to create manufacturingordercode');
//   //     return new GlobalResponseObject(true, 0, 'Manufacturing Order List Information Saved Successfully.');
//   //   } catch (error) {
//   //     await transactionalEntityManager.releaseTransaction();
//   //     throw error;
//   //   }
//   // }

//   // //Not Used for now
//   // async getOpenManufacturingOrderList(req: ManufacturingOrderListRequest): Promise<CommonResponse> {
//   //   try {
//   //     const result = await this.orderListRepo.find({ where: { status: MoStatusEnum.OPEN, companyCode: req.companyCode, unitCode: req.unitCode } });
//   //     return new CommonResponse(true, 0, 'Manufacturing Order List Retrived Successfully.', result);
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }
//         if (existingRecord) {
//           continue;
//         }
//         // If no existing record, save the new orderListData
//         await transactionalEntityManager.getRepository(OrderListEntity).save(orderListData);
//         await transactionalEntityManager.completeTransaction();
//       }
//       // console.log('--called to create manufacturingordercode');
//       return new GlobalResponseObject(true, 1053, 'Manufacturing Order List Information Saved Successfully.');
//     } catch (error) {
//       await transactionalEntityManager.releaseTransaction();
//       throw error;
//     }
//   }

//   //Not Used for now
//   async getOpenManufacturingOrderList(req: ManufacturingOrderListRequest): Promise<CommonResponse> {
//     try {
//       const result = await this.orderListRepo.find({ where: { status: MoStatusEnum.OPEN, companyCode: req.companyCode, unitCode: req.unitCode } });
//       return new CommonResponse(true, 1054, 'Manufacturing Order List Retrived Successfully.', result);
//     } catch (error) {
//       throw error;
//     }
//   }
// >>>>>>>> xapparel_apparel_final:packages/services/order-management/src/app/order-management/pre-integration.service.ts

//   // async getOrdersWithSelectedFields(req: OrderNoRequest): Promise<OrderWithSelectedFieldsResponse[]> {
//   //   try {
//   //     const orders = await this.orderRepo.getOrdersWithSelectedFields((req.orderNos), req.companyCode, req.unitCode);
//   //     if (!orders || orders.length === 0) {
//   //       throw new Error('No orders found');
//   //     }
//   //     return orders;
//   //   } catch (error) {
//   //     console.error('Error retrieving orders:', error);
//   //     throw new Error('Error retrieving orders');
//   //   }
//   // }

//   // // creating job for each manufacturingorder
//   // async triggerManufacturingOrderintoOMS(req: CommonRequestAttrs): Promise<GlobalResponseObject> {
//   //   try {
//   //     const records = await this.orderListRepo.find({ where: { status: MoStatusEnum.OPEN, companyCode: req.companyCode, unitCode: req.unitCode } });
//   //     if (records.length > 0) {
//   //       for (const record of records) {
//   //         try {
//   //           const reqobj = new ManufacturingOrderNumberRequest('integration', req.unitCode, req.companyCode, 1, record.manufacturingOrderNo);
//   //           await this.saveManufacturingOrderInformation(reqobj);
//   //         } catch (error) {
//   //           const soCreationError = new OrderCreationLogEntity();
//   //           soCreationError.companyCode = req.companyCode;
//   //           soCreationError.unitCode = req.unitCode;
//   //           soCreationError.createdUser = req.username;
//   //           soCreationError.status = MoStatusEnum.OPEN;
//   //           soCreationError.message = error?.toString();
//   //           soCreationError.manufacturingOrderNo = record.manufacturingOrderNo;
//   //           await this.orderErrorRepo.save(soCreationError);
//   //           // simply log the error message and continue with the next SO
//   //         }
//   //       }
//   //     }
//   //     return new GlobalResponseObject(true, 0, 'Job Added for order creation Successfully.');
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

// <<<<<<<< HEAD:packages/services/order-management/src/app-old/order-management/pre-integration.service.ts
// ========
//   // creating job for each manufacturingorder
//   async triggerManufacturingOrderintoOMS(req: CommonRequestAttrs): Promise<GlobalResponseObject> {
//     try {
//       const records = await this.orderListRepo.find({ where: { status: MoStatusEnum.OPEN, companyCode: req.companyCode, unitCode: req.unitCode } });
//       if (records.length > 0) {
//         for (const record of records) {
//           try {
//             const reqobj = new ManufacturingOrderNumberRequest('integration', req.unitCode, req.companyCode, 1, record.manufacturingOrderNo);
//             await this.saveManufacturingOrderInformation(reqobj);
//           } catch (error) {
//             const soCreationError = new OrderCreationLogEntity();
//             soCreationError.companyCode = req.companyCode;
//             soCreationError.unitCode = req.unitCode;
//             soCreationError.createdUser = req.username;
//             soCreationError.status = MoStatusEnum.OPEN;
//             soCreationError.message = error?.toString();
//             soCreationError.manufacturingOrderNo = record.manufacturingOrderNo;
//             await this.orderErrorRepo.save(soCreationError);
//             // simply log the error message and continue with the next SO
//           }
//         }
//       }
//       return new GlobalResponseObject(true, 1055, 'Job Added for order creation Successfully.');
//     } catch (error) {
//       throw error;
//     }
//   }
// >>>>>>>> xapparel_apparel_final:packages/services/order-management/src/app/order-management/pre-integration.service.ts
// }