import { OrderTypeEnum } from "../../enum";

export class PoOrderSubLineModel {

    plannedDeliveryDate: string;
    destination: string;
    plannedProductionDate: string;
    plannedCutDate: string;
    coLine: string;
    buyerPo: string;
    garmentVendorPo: string;
    productType: string
    productName: string;
    productCategory: string;
    schedule: string;
    fgColor: string;
    size: string;
    zFeature: string;
    orderLineRefNo: string;
    poSerial: number;
    porderSubLineId: number;
    plantStyle: string;
    orderSubLineRefId: number
    quantity: number;
    oqType: OrderTypeEnum;
    orderRefNo: string;
    constructor(plannedDeliveryDate: string, destination: string, plannedProductionDate: string, plannedCutDate: string, coLine: string, buyerPo: string, garmentVendorPo: string, productType: string,
        productName: string, productCategory: string, schedule: string, fgColor: string, size: string, zFeature: string, orderLineRefNo: string, poSerial: number, porderSubLineId: number, plantStyle: string, orderSubLineRefId: number, quantity: number, oqType: OrderTypeEnum, orderRefNo: string) {
        this.plannedDeliveryDate = plannedDeliveryDate
        this.destination = destination
        this.plannedProductionDate = plannedProductionDate
        this.plannedCutDate = plannedCutDate
        this.coLine = coLine
        this.buyerPo = buyerPo
        this.garmentVendorPo = garmentVendorPo
        this.productType = productType
        this.productName = productName
        this.productCategory = productCategory
        this.schedule = schedule
        this.fgColor = fgColor
        this.size = size
        this.zFeature = zFeature
        this.orderLineRefNo = orderLineRefNo
        this.poSerial = poSerial
        this.porderSubLineId = porderSubLineId
        this.plantStyle = plantStyle
        this.orderSubLineRefId = orderSubLineRefId
        this.quantity = quantity;
        this.oqType = oqType;
        this.orderRefNo = orderRefNo;

    }

}