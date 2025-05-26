import { CommonRequestAttrs } from "../../common";
import { PackMoLineInfo } from "./mo-line-info";

export class PackOrderCreationModel extends CommonRequestAttrs {
    orderid: number;
    orderNumber: string; // order
    quantity: number;
    style: string;
    externalSystemRefNo: string;
    customerStyle: string;
    customerStyleRef: string;
    customerNo: string; // order
    customerName: string; // order
    deliveryDate: string;
    destination: string;
    PlannedCutDate: string;
    coLine: string;
    buyerPo: string;
    packMethod: string; //??
    productType: string;//order
    productName: string;//order
    productCategory: string;//order
    garmentVendorPo: string;
    description: string;
    moLineInfo: PackMoLineInfo[];
    pkOrderId: number;
    pkSerial: number;
    planProductionDate: string;
    coNos: string;
    buyerNames: string;
    customerNames: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        orderid: number,
        orderNumber: string,
        quantity: number,
        style: string,
        externalSystemRefNo: string,
        customerStyle: string,
        customerStyleRef: string,
        customerNo: string,
        customerName: string,
        deliveryDate: string,
        destination: string,
        PlannedCutDate: string,
        coLine: string,
        buyerPo: string,
        packMethod: string,
        productType: string,
        productName: string,
        productCategory: string,
        garmentVendorPo: string,
        description: string,
        moLineInfo: PackMoLineInfo[],
        pkOrderId: number,
        pkSerial: number,
        planProductionDate: string,
        coNos: string,
        buyerNames: string,
        customerNames: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.orderid = orderid;
        this.orderNumber = orderNumber;
        this.quantity = quantity;
        this.style = style;
        this.externalSystemRefNo = externalSystemRefNo;
        this.customerStyle = customerStyle;
        this.customerStyleRef = customerStyleRef;
        this.customerNo = customerNo;
        this.customerName = customerName;
        this.deliveryDate = deliveryDate;
        this.destination = destination;
        this.PlannedCutDate = PlannedCutDate;
        this.coLine = coLine;
        this.buyerPo = buyerPo;
        this.productType = productType;
        this.productName = productName;
        this.productCategory = productCategory;
        this.garmentVendorPo = garmentVendorPo;
        this.description = description;
        this.moLineInfo = moLineInfo;
        this.description = description;
        this.pkOrderId = pkOrderId;
        this.pkSerial = pkSerial;
        this.packMethod = packMethod;
        this.planProductionDate = planProductionDate;
        this.coNos = coNos;
        this.buyerNames = buyerNames;
        this.customerNames = customerNames;

    }


}