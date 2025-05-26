// import { MoProductStatusEnum, MoStatusEnum } from "../enum";
import { MoProductStatusEnum } from "../../oms/enum";
import { SubProductItemModel } from "./sub-product-item.model";

export class ProductItemModel {
    prodId: number;
    orderId: number;
    orderNo: string;
    style: string; // not rquired in request
    styleCode: string; // not rquired in request
    styleDesc: string; // not rquired in request
    productType: string; // not rquired in request
    totalSubProducts: number; // not rquired in request
    productConfirmationStatus: MoProductStatusEnum;
    subProducts: SubProductItemModel[];

    constructor(
        orderNo: string,
        orderId: number,
        subProducts: SubProductItemModel[],
        style: string,
        styleCode: string,
        styleDesc: string,
        productType: string,
        totalSubProducts: number,
        productConfirmationStatus: MoProductStatusEnum,
        prodId: number
    ) {
        this.orderNo = orderNo;
        this.orderId = orderId;
        this.subProducts = subProducts;
        this.style = style;
        this.styleCode = styleCode;
        this.styleDesc = styleDesc;
        this.productType = productType;
        this.totalSubProducts = totalSubProducts;
        this.productConfirmationStatus = productConfirmationStatus;
        this.prodId = prodId;
    }
}

