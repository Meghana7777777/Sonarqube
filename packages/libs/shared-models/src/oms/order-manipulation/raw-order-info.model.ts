
// import { MoProductStatusEnum } from "../../oms-old";
import { MoProductStatusEnum, PackMethodEnum } from "../enum";
import { RawOrderLineInfoModel } from "./raw-order-line-info.model";
import { RawOrderPackMethodModel } from "./raw-order-pack-method.model";

export class RawOrderInfoModel {
    orderIdPk: number;
    orderNo: string; // the main ref for the order that is unique. it could be anything (Manufacturing Order/purchase order)
    salOrdNo: string;
    purOrdNo: string; // buyer po
    prodType: string; // the prod type shirt/tshirt // distinct
    quantity: number; // TOTAL ORDER
    style: string;  // style
    extSysRefNo: string; // usually the main ref no with the external systems // no number
    customerStyle: string; // 
    customerStyleRef: string; 
    customerOrderNo: string; 
    buyerName: string; 
    packMethod: PackMethodEnum; // this should be ENUM (1Pack, 2 Pack et..) // lyt teesko
    garmentVendor: string; 
    manufacturer: string; // Company code
    packMethodConfirmed: boolean // TRUE: If the pack methods are defined and are confirmed by the user and we created the duplicate lines // false
    orderLines: RawOrderLineInfoModel[]; // 
    sizes: string[]; 
    packMethods: RawOrderPackMethodModel[]; // []
    moConfirmed: boolean; // 
    sizeBreakDownDone: boolean; // false
    productConfirmed: MoProductStatusEnum; // confirmed
    garmentPo: string; 
    buyerPo: string;
    buyerPoLine: string; // no need
    garmentPoLine: string; // no need
    plantStyle: string; // style code
    plannedCutDate: string; // pcd

    constructor(
        orderIdPk: number,
        orderNo: string, 
        purOrdNo: string,
        prodType: string, 
        quantity: number ,
        style: string,
        extSysRefNo: string, 
        customerStyle: string,
        customerStyleRef: string,
        customerOrderNo: string,
        buyerName: string,
        packMethod: PackMethodEnum,
        garmentVendor: string,
        manufacturer: string,
        packMethodConfirmed: boolean,
        moConfirmed: boolean,
        sizeBreakDownDone: boolean,
        orderLines: RawOrderLineInfoModel[],
        sizes: string[],
        packMethods: RawOrderPackMethodModel[],
        productConfirmed: MoProductStatusEnum,
        garmentPo: string,
        buyerPo: string,
        buyerPoLine: string,
        garmentPoLine: string,
        plantStyle: string,
        plannedCutDate: string
    ){
        this.orderIdPk = orderIdPk;
        this.orderNo = orderNo;
        this.purOrdNo = purOrdNo;
        this.prodType = prodType;
        this.quantity = quantity;
        this.style = style;
        this.extSysRefNo = extSysRefNo;
        this.customerStyle = customerStyle;
        this.customerStyleRef = customerStyleRef;
        this.customerOrderNo = customerOrderNo;
        this.buyerName = buyerName;
        this.packMethod = packMethod;
        this.garmentVendor = garmentVendor;
        this.manufacturer = manufacturer;
        this.packMethodConfirmed = packMethodConfirmed;
        this.orderLines = orderLines;
        this.sizes = sizes;
        this.packMethods = packMethods;
        this.moConfirmed = moConfirmed;
        this.sizeBreakDownDone = sizeBreakDownDone;
        this.productConfirmed = productConfirmed;
        this.garmentPo = garmentPo;
        this.buyerPo = buyerPo;
        this.buyerPoLine = buyerPoLine;
        this.garmentPoLine = garmentPoLine;
        this.plantStyle = plantStyle;
        this.plannedCutDate = plannedCutDate;
    }
}

