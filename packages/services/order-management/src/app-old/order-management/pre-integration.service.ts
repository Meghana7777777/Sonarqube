import { Injectable } from "@nestjs/common";
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

@Injectable()
export class PreIntegrationServiceOms {}
//   constructor(
//     private dataSource: DataSource,
//     private preIntegrationWms: PreIntegrationService,
//     private orderListRepo: OrderListRepository,
//     private orderRepo: OrderRepository,
//     private orderErrorRepo: OrderCreationLogRepository,
//     private soInfoRepo: SoInfoRepository,
//   ) {
//   }

//   async saveSaleOrderInformation(req: ManufacturingOrderNumberRequest): Promise<any> {
//     const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
//     try {
//       const saleOrderData = await this.preIntegrationWms.getSaleorderInformation(req);
//       await transactionalEntityManager.startTransaction();
//       if (saleOrderData) {
//         const existingRecord = await this.orderRepo.findOne({
//           where: {
//             orderNo: saleOrderData.data.basicSaleOrderDetails.saleOrder,
//             companyCode: req.companyCode,
//             unitCode: req.unitCode
//           }
//         });
//         if (existingRecord) {
//           throw new ErrorResponse(1051, 'This Sale Order Information already exists.');
//         }
//         const orders = new OrderEntity();
//         orders.orderNo = saleOrderData.data.basicSaleOrderDetails.saleOrder;
//         orders.refId = saleOrderData.data.basicSaleOrderDetails.saleOrderId;
//         orders.co = saleOrderData.data.basicSaleOrderDetails.saleOrder;
//         orders.coDesc = '';
//         orders.buyerDesc = saleOrderData.data.basicSaleOrderDetails.customerName;
//         orders.buyerLocation = saleOrderData.data.basicSaleOrderDetails.customerCode;
//         orders.quantity = saleOrderData.data.basicSaleOrderDetails.quantity;
//         orders.customerCode = saleOrderData.data.basicSaleOrderDetails.customerCode;
//         orders.customerName = saleOrderData.data.basicSaleOrderDetails.customerName;
//         orders.profitCenterCode = saleOrderData.data.basicSaleOrderDetails.profitCenterCode;
//         orders.profitCenterName = saleOrderData.data.basicSaleOrderDetails.profitCenterName;
//         orders.productName = saleOrderData.data.basicSaleOrderDetails.productName;
//         orders.productCategory = saleOrderData.data.basicSaleOrderDetails.productCategory;
//         orders.styleName = saleOrderData.data.basicSaleOrderDetails.styleName;
//         orders.styleCode = saleOrderData.data.basicSaleOrderDetails.styleCode;
//         orders.styleDesc = saleOrderData.data.basicSaleOrderDetails.styleDesc;
//         orders.companyCode = req.companyCode;
//         orders.unitCode = req.unitCode;
//         orders.createdUser = req.username;
//         orders.soProgressStatus = MoStatusEnum.OPEN;
//         const saveOrderResponse = await transactionalEntityManager.getRepository(OrderEntity).save(orders);
//         for (const saleOrderItem of saleOrderData.data.saleOrderItems) {
//           const orderLine = new OrderLineEntity();
//           orderLine.styleName = saleOrderItem.styleName;
//           orderLine.styleCode = saleOrderItem.styleCode;
//           orderLine.styleDesc = saleOrderItem.styleDesc;
//           orderLine.orderId = saveOrderResponse;
//           orderLine.orderLineNo = saleOrderItem.saleOrderItemNo;
//           orderLine.coLine = saleOrderItem.saleOrderItemNo;
//           orderLine.quantity = saleOrderItem.quantity;
//           orderLine.buyerPo = saleOrderItem.buyerPo;
//           orderLine.eRefNo = saleOrderItem.saleOrderItemNo;
//           orderLine.garmentVendorCode = saleOrderItem.garmentVendorCode;
//           orderLine.garmentVendorName = saleOrderItem.garmentVendorName;
//           orderLine.garmentVendorUnit = saleOrderItem.garmentVendorUnit;
//           orderLine.garmentVendorPo = saleOrderItem.garmentVendorPo;
//           orderLine.garmentVendorPoItem = saleOrderItem.garmentVendorPoItem;
//           orderLine.companyCode = req.companyCode;
//           orderLine.unitCode = req.unitCode;
//           orderLine.createdUser = req.username;
//           orderLine.colorDesc = 'NA';
//           orderLine.colorCode = 'NA';
//           orderLine.poSerial = 0;
//           orderLine.plannedCutDate = saleOrderItem.plannedCutDate;
//           orderLine.plannedProductionDate = saleOrderItem.plannedProductionDate;
//           orderLine.plannedDeliveryDate = saleOrderItem.plannedDeliveryDate;
//           // orderLine.OrderLineRmEntity = [];
//           const saveOrderLineResponse = await transactionalEntityManager.getRepository(OrderLineEntity).save(orderLine);
//           const filteredItemsFabric = saleOrderData.data.saleOrderItemsData.filter(item => item.saleOrderItemNo === saleOrderItem.saleOrderItemNo);
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
//         await this.orderListRepo.update({ companyCode: req.companyCode, unitCode: req.unitCode, saleOrderNo: saleOrderData.data.basicSaleOrderDetails.saleOrder }, { status: MoStatusEnum.DONWLOADED, updatedUser: req.username });
//       }
//       await transactionalEntityManager.completeTransaction();
//       return new GlobalResponseObject(true, 1052, 'Sale Order Information Saved Succussfully.');
//     } catch (error) {
//       await transactionalEntityManager.releaseTransaction();
//       throw error;
//     }
//   }

//   // // Will be called when we upload the order details into the WMS
//   // async saveSaleOrderListInformation(req: ManufacturingOrderListRequest): Promise<any> {
//   //   const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
//   //   try {
//   //     // console.log('--called to create saleordercode');
//   //     // console.log(req.saleOrderList);
//   //     await transactionalEntityManager.startTransaction();
//   //     for (const saleOrderNumber of req.saleOrderList) {
//   //       const orderListData = new OrderListEntity();
//   //       orderListData.saleOrderNo = saleOrderNumber;
//   //       orderListData.companyCode = req.companyCode;
//   //       orderListData.unitCode = req.unitCode;
//   //       orderListData.createdUser = req.username;
//   //       orderListData.status = 0;
//   //       // Check if a record with the same sale order number, company code, and unit code already exists
//   //       const existingRecord = await transactionalEntityManager.getRepository(OrderListEntity).findOne({
//   //         where: {
//   //           saleOrderNo: saleOrderNumber,
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
//   //     // console.log('--called to create saleordercode');
//   //     return new GlobalResponseObject(true, 0, 'Sale Order List Information Saved Successfully.');
//   //   } catch (error) {
//   //     await transactionalEntityManager.releaseTransaction();
//   //     throw error;
//   //   }
//   // }

//   // //Not Used for now
//   // async getOpenSaleOrderList(req: ManufacturingOrderListRequest): Promise<CommonResponse> {
//   //   try {
//   //     const result = await this.orderListRepo.find({ where: { status: MoStatusEnum.OPEN, companyCode: req.companyCode, unitCode: req.unitCode } });
//   //     return new CommonResponse(true, 0, 'Sale Order List Retrived Successfully.', result);
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
//       // console.log('--called to create saleordercode');
//       return new GlobalResponseObject(true, 1053, 'Sale Order List Information Saved Successfully.');
//     } catch (error) {
//       await transactionalEntityManager.releaseTransaction();
//       throw error;
//     }
//   }

//   //Not Used for now
//   async getOpenSaleOrderList(req: ManufacturingOrderListRequest): Promise<CommonResponse> {
//     try {
//       const result = await this.orderListRepo.find({ where: { status: MoStatusEnum.OPEN, companyCode: req.companyCode, unitCode: req.unitCode } });
//       return new CommonResponse(true, 1054, 'Sale Order List Retrived Successfully.', result);
//     } catch (error) {
//       throw error;
//     }
//   }

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

//   // // creating job for each saleorder
//   // async triggerSaleOrderintoOMS(req: CommonRequestAttrs): Promise<GlobalResponseObject> {
//   //   try {
//   //     const records = await this.orderListRepo.find({ where: { status: MoStatusEnum.OPEN, companyCode: req.companyCode, unitCode: req.unitCode } });
//   //     if (records.length > 0) {
//   //       for (const record of records) {
//   //         try {
//   //           const reqobj = new ManufacturingOrderNumberRequest('integration', req.unitCode, req.companyCode, 1, record.saleOrderNo);
//   //           await this.saveSaleOrderInformation(reqobj);
//   //         } catch (error) {
//   //           const soCreationError = new OrderCreationLogEntity();
//   //           soCreationError.companyCode = req.companyCode;
//   //           soCreationError.unitCode = req.unitCode;
//   //           soCreationError.createdUser = req.username;
//   //           soCreationError.status = MoStatusEnum.OPEN;
//   //           soCreationError.message = error?.toString();
//   //           soCreationError.saleOrderNo = record.saleOrderNo;
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

//   // creating job for each saleorder
//   async triggerSaleOrderintoOMS(req: CommonRequestAttrs): Promise<GlobalResponseObject> {
//     try {
//       const records = await this.orderListRepo.find({ where: { status: MoStatusEnum.OPEN, companyCode: req.companyCode, unitCode: req.unitCode } });
//       if (records.length > 0) {
//         for (const record of records) {
//           try {
//             const reqobj = new ManufacturingOrderNumberRequest('integration', req.unitCode, req.companyCode, 1, record.saleOrderNo);
//             await this.saveSaleOrderInformation(reqobj);
//           } catch (error) {
//             const soCreationError = new OrderCreationLogEntity();
//             soCreationError.companyCode = req.companyCode;
//             soCreationError.unitCode = req.unitCode;
//             soCreationError.createdUser = req.username;
//             soCreationError.status = MoStatusEnum.OPEN;
//             soCreationError.message = error?.toString();
//             soCreationError.saleOrderNo = record.saleOrderNo;
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
// }