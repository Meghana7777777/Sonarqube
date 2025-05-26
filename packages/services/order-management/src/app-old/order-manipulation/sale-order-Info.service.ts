import { Injectable } from "@nestjs/common";
import { RawMaterialInfoRepository } from "../common/repository/rm-info.repository";
import { SoInfoRepository } from "../common/repository/mo-info.repository";
import { SoLineProductRepository } from "../common/repository/mo-line-product.repository";
import { SoLineRepository } from "../common/repository/mo-line.repository";
import { SoProductSubLineRepository } from "../common/repository/mo-product-sub-line.repository";
import { CommonRequestAttrs, RawOrderHeaderInfoModel, RawOrderHeaderInfoResponse, RawOrderInfoModel, RawOrderInfoResponse, RawOrderLineInfoModel, RawOrderLineRmModel, RawOrderNoRequest, RawOrderSubLineInfoModel, MoStatusRequest } from "@xpparel/shared-models";
import { SoLineEntity } from "../common/entity/mo-line.entity";
import { RmInfoEntity } from "../common/entity/rm-info.entity";
import { PslOperationRepository } from "../common/repository/psl-operation.repository";
import { PslOpRawMaterialRepository } from "../common/repository/psl-opearation-rm.repository";
import { SoInfoEntity } from "../common/entity/mo-info.entity";
import { In } from "typeorm";
import { SoProductSubLineEntity } from "../common/entity/mo-product-sub-line.entity";

@Injectable()
export class SaleOrderInfoService {
    constructor(
        private soInFoRepo: SoInfoRepository,
        private soLineRepo: SoLineRepository,
        private soLineProductRepo: SoLineProductRepository,
        private soProductSubLineRepo: SoProductSubLineRepository,
        private pslOpRepo: PslOperationRepository,
        private pslOpRmRepo: PslOpRawMaterialRepository,
        private rmInfoRepo: RawMaterialInfoRepository

    ) { }


    /**
      * Service to get order raw details for given order no
      * @param orderNo 
      * @param unitCode 
      * @param companyCode 
      * @returns Order details entity
     */
    async getOrderDetailsByOrderId(orderId: number, unitCode: string, companyCode: string): Promise<SoInfoEntity> {
        return await this.soInFoRepo.findOne({ where: { id: orderId, unitCode, companyCode, isActive: true } });
    }



    /**
  * Service to get the oder sizes by order Id
  * @param orderId 
  * @param unitCode 
  * @param companyCode 
  * @returns 
  */
    async getUniqueSizesByOrderNumber(soNumber: string, unitCode: string, companyCode: string): Promise<string[]> {
        try {
            const subLines = await this.soProductSubLineRepo.find({
                where: {
                    soNumber: soNumber,
                    unitCode: unitCode,
                    companyCode: companyCode,
                    isActive: true
                },
                select: ['size'],
            });

            const uniqueSizes = [...new Set(subLines.map(subLine => subLine.size))];
            return uniqueSizes;
        } catch (error) {
            console.error('Error fetching unique sizes:', error);
        }
    }


    async getOrderLineDetailsByOrderId(orderId: number, unitCode: string, companyCode: string, iNeedOriginalMoLines?: boolean): Promise<SoLineEntity[]> {

        return await this.soLineRepo.find({ where: { soId: orderId, unitCode, companyCode } });

    }




    async getOrderRmSkuMappingByOrderLineId(orderLineId: number, unitCode: string, companyCode: string): Promise<RmInfoEntity[]> {
        try {
            const soLineProduct = await this.soLineProductRepo.find({ select: ['id'], where: { soLineId: orderLineId, unitCode, companyCode } });
            console.log(soLineProduct,"soLineProduct")


            const productSubLine = await this.soProductSubLineRepo.find({ select: ['id'], where: { soLineProductId: In(soLineProduct.map(subLine => subLine.id))} });
            console.log(productSubLine,"productSubline")

            const opInfo = await this.pslOpRepo.find({ select: ['id'], where: { soProductSubLineId: In(productSubLine.map(subLine => subLine.id)) } });
            console.log(opInfo,"opInfo")


            const opRmInfo = await this.pslOpRmRepo.find({ select: ['itemCode'], where: { pslOperationId: In(opInfo.map(op => op.id)) } });
            console.log(opRmInfo,"opRmInfo")


            return await this.rmInfoRepo.find({ where: { itemCode: In(opRmInfo.map(rm => rm.itemCode)), unitCode, companyCode } });
        } catch (error) {
            console.error('Error fetching RM SKU mapping:', error.message);
        }
    }


    async getOrderSubLineDetailsByOrderLineId(orderLineId: number, unitCode: string, companyCode: string): Promise<SoProductSubLineEntity[]> {
        const soLineProduct = await this.soLineProductRepo.find({ select: ['id'], where: { soLineId: orderLineId, unitCode, companyCode } });

        return await this.soProductSubLineRepo.find({ select: ['id'], where: { soLineProductId: In(soLineProduct.map(product => product.id)) } });

    }

    async getSubLineDetailsByLineId(lineId: number, companyCode: string, unitCode: string): Promise<SoProductSubLineEntity> {
        const lineProductDetils = await this.soLineProductRepo.findOne({ where: { soLineId: lineId, companyCode: companyCode, unitCode: unitCode } })
        const productSubLineDetails = await this.soProductSubLineRepo.findOne({ where: { soLineProductId: lineProductDetils.id } })

        return productSubLineDetails
    }

    async getRawOrderInfo(req: RawOrderNoRequest): Promise<RawOrderInfoResponse> {
        console.log(req, "reqiues")

        try {
            const unitCode = req.unitCode;
            const companyCode = req.companyCode;
            const orderDetails = await this.getOrderDetailsByOrderId(req.orderId, unitCode, companyCode);

            if (!orderDetails) {
                return new RawOrderInfoResponse(false, 0, 'Order not found', []);
            }
            let sizeBreakDownDone = false;
            const orderSizes = await this.getUniqueSizesByOrderNumber(req.salOrdNo, unitCode, companyCode);
            // const rmSkuDetails = await this.getOrderRmSkuMappingByOrderNumber(req.salOrdNo, unitCode, companyCode);//Todo
            const packMethodConfirmed = true ? true : false
            const orderMoLines = [];
            let garmentVendor = '';
            let garmentTrue = '';
            let buyerPo = '';
            let buyerPoline = '';
            let garmentPo = '';
            let garmentPoLine = '';
            // const productInfo: ProductEntity = await this.orderManipulationHelper.getProductRecordSaleOrderId(req.orderId, unitCode, companyCode);
            // if (req.iNeedMoLines) {
            //     const orderLines: SoLineEntity[] = await this.getOrderLineDetailsByOrderId(req.orderId, unitCode, companyCode, req.iNeedOriginalMoLines);
            //     console.log(orderLines, "OrderLines")
            //     for (const orderLine of orderLines) {
            //         const orderSubLines: RawOrderSubLineInfoModel[] = [];
            //         const orderLineRmDetails: RawOrderLineRmModel[] = [];
            //         const rmSkuDetails = await this.getOrderRmSkuMappingByOrderLineId(orderLine.id, unitCode, companyCode);
            //         console.log(rmSkuDetails, "rmSkuuu")
            //         const skuMapped = rmSkuDetails?.length ? true : false;
            //         const subOrderDetails = await this.getOrderSubLineDetailsByOrderLineId(orderLine.id, unitCode, companyCode);
            //         const sizesMapped = subOrderDetails?.length ? true : false;
            //         subOrderDetails.length > 0 ? sizeBreakDownDone = true : '';
            //         // if (req.iNeedMoLineSubLines) {
            //         //     for (const eachSubLine of subOrderDetails) {
            //         //         const subLineInfo = new RawOrderSubLineInfoModel(orderLine.id, eachSubLine.id, eachSubLine.id.toString(), eachSubLine.fgColor, eachSubLine.size, eachSubLine.quantity, eachSubLine.id.toString(), eachSubLine.id.toString(), [], []);
            //         //         orderSubLines.push(subLineInfo);
            //         //     }
            //         // }
            //         // if (req.iNeedMoLineRm) {
            //         //     for (const eachRm of rmSkuDetails) {
            //         //         const rmDetails = new RawOrderLineRmModel(eachRm.itemCode, eachRm.itemDesc, eachRm.itemColor, eachRm.itemCode, eachRm.itemType, eachRm.itemSubType, eachRm.consumption, eachRm.wastage, null);
            //         //         orderLineRmDetails.push(rmDetails);
            //         //     }
            //         // }
            //         const prodDetails = await this.soLineProductRepo.findOne({ where: { soLineId: orderLine.id } })
            //         const subLineDetails = await this.getSubLineDetailsByLineId(orderLine.id, req.companyCode, req.unitCode)
            //         const orderLineInfo = new RawOrderLineInfoModel(orderLine.id, orderLine.soLineNumber,
            //             subLineDetails.fgColor, subLineDetails.quantity, orderLine.soLineNumber, subLineDetails.deliveryDate,
            //             subLineDetails.destination, orderDetails.exFactoryDate, prodDetails.productCode, prodDetails.productType, orderDetails.soRefNo, true, orderLine.soLineNumber + prodDetails.productCode + subLineDetails.size, skuMapped, sizesMapped, orderSubLines, orderLineRmDetails, [],
            //             orderSizes, 0, orderDetails.coNumber, prodDetails.productName, subLineDetails.planCutDate, subLineDetails.planProdDate, subLineDetails.deliveryDate, subLineDetails.id);
            //         orderMoLines.push(orderLineInfo);
            //         // garmentVendor = orderLine.garmentVendorName;

            //         // garmentTrue = orderLine.garmentVendorUnit;
            //         // buyerPo = orderLine.buyerPo;
            //         buyerPoline = '';
            //         // garmentPo = orderLine.garmentVendorPo;
            //         garmentPoLine = '';
            //     }

            // }
            orderMoLines.sort((a, b) => Number(a.orderLineNo) - Number(b.orderLineNo));
            // const packMethodModels = await this.getPackMethodModelsForOrderId(req.orderId, companyCode, unitCode);
            const orderInfo = new RawOrderInfoModel(orderDetails.id, orderDetails.soNumber, orderDetails.coNumber, orderDetails.coNumber, orderDetails.quantity, orderDetails.style, orderDetails.soRefNo, orderDetails.styleName, orderDetails.styleDescription, orderDetails.coNumber, orderDetails.customerName, null, garmentVendor, garmentTrue, packMethodConfirmed, orderDetails.isConfirmed > 0 ? true : false, sizeBreakDownDone, orderMoLines, orderSizes, [], null, garmentPo, buyerPo, buyerPoline, garmentPoLine, orderDetails.plantStyleRef, orderDetails.exFactoryDate,);
            return new RawOrderInfoResponse(true, 1, '', [orderInfo]);
        } catch (error) {
            // console.log(error);
            return error;
        }
    }



    async getAllUnconfirmedOrders(req: CommonRequestAttrs): Promise<RawOrderInfoResponse> {
        try {
            const ordersInfo: RawOrderInfoModel[] = [];
            const openOrderInfo = await this.soInFoRepo.find({ where: { isConfirmed: 0 } });
            for (const eachOrder of openOrderInfo) {
                const reqObj = new RawOrderNoRequest(req.username, req.unitCode, req.companyCode, req.userId, eachOrder.soNumber, eachOrder.id, null, null, null, true, true, true, true, true);
                const orderInfo = await this.getRawOrderInfo(reqObj);
                // const orderInfo = null;

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

    async getOpenSo(req: MoStatusRequest): Promise<RawOrderInfoResponse> {
        try {
            const ordersInfo: RawOrderInfoModel[] = [];
            const openOrderInfo = await this.soInFoRepo.find({ where: { isConfirmed: 1 } });
            for (const eachOrder of openOrderInfo) {
                const reqObj = new RawOrderNoRequest(req.username, req.unitCode, req.companyCode, req.userId, null, eachOrder.id, null, null, null, true, true, true, true, true);
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


    async getInProgressSo(req: CommonRequestAttrs): Promise<RawOrderInfoResponse> {
        try {
            const ordersInfo: RawOrderInfoModel[] = [];
            const inProgressOrdersInfo = await this.soInFoRepo.find({ where: { isConfirmed: 2 } });
            console.log(inProgressOrdersInfo, "inProgressOrdersInfo")
            for (const eachOrder of inProgressOrdersInfo) {
                const reqObj = new RawOrderNoRequest(req.username, req.unitCode, req.companyCode, req.userId, eachOrder.soNumber, eachOrder.id, null, null, null, false, false, false, false, false);
                console.log(reqObj, "reqOnj")
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



    async getRawOrderHeaderInfo(req: RawOrderNoRequest): Promise<RawOrderHeaderInfoResponse> {  //ToDo --  confirm the tables from which the data is to be fetched
        if (!req.orderId) {

        }
        const orderRec = await this.getOrderDetailsByOrderId(req.orderId, req.unitCode, req.companyCode);
        if (!orderRec) {
        }
        let sizesConfirmed = false;
        let packMethodConfirmed = false;
        let sizeBreakConfirmed = false;
        let productConfirmed = false;
        // const sizes = await this.orderSizesRepo.findOne({ select: ['id'], where: { orderId: req.orderId, companyCode: req.companyCode, unitCode: req.unitCode } });
        // sizesConfirmed = sizes ? true : false;
        // const packMethod = await this.packMethodRepo.findOne({ select: ['id'], where: { orderId: req.orderId, companyCode: req.companyCode, unitCode: req.unitCode } });
        // packMethodConfirmed = packMethod ? true : false;
        // const sizeBreaks = await this.orderSubLineRepo.findOne({ select: ['id'], where: { orderId: req.orderId, companyCode: req.companyCode, unitCode: req.unitCode } });
        // sizeBreakConfirmed = sizeBreaks ? true : false;
        // const prodRecord = await this.orderManipulationHelper.getProductRecordSaleOrderId(req.orderId, req.unitCode, req.companyCode);
        // productConfirmed = prodRecord?.confirmationStatus == MoProductStatusEnum.CONFIRMED;
        const headerModel = new RawOrderHeaderInfoModel(orderRec.styleName, orderRec.styleDescription, orderRec.customerName, orderRec.soNumber, orderRec.coNumber, orderRec.profitCenterName, sizesConfirmed, packMethodConfirmed, sizeBreakConfirmed, orderRec.isConfirmed, productConfirmed);
        return new RawOrderHeaderInfoResponse(true, 0, 'Header info retrieved', [headerModel]);
    }
}