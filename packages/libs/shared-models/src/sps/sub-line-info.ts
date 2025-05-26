export class SubLineInfo {
    moLine: string;
    cutSerial: number;
    subLineId: number;
    color: string;
    size: string;
    quantity: number;
    deliveryDate: string;
    destination: string;
    PlannedCutDate: string;
    coLine: string;
    buyerPo: string;
    productType: string;
    productName: string;
    productCategory: string;
    garmentVendorPo: string;
    sSubLineId: number;
    planProductionDate: string;
    style: string;
    garmentPo: string;
    moNumber: string;

    constructor(
        moLine: string,
        cutSerial: number,
        subLineId: number,
        color: string,
        size: string,
        quantity: number,
        deliveryDate: string,
        destination: string,
        PlannedCutDate: string,
        coLine: string,
        buyerPo: string,
        productType: string,
        productName: string,
        productCategory: string,
        garmentVendorPo: string,
        sSubLineId: number,
        planProductionDate: string,
        style: string,
        garmentPo: string,
        moNumber: string
    ) {

        this.moLine = moLine;
        this.cutSerial = cutSerial;
        this.subLineId = subLineId;
        this.color = color;
        this.size = size,
            this.quantity = quantity,
            this.deliveryDate = deliveryDate;
        this.destination = destination;
        this.PlannedCutDate = PlannedCutDate;
        this.coLine = coLine;
        this.buyerPo = buyerPo;
        this.productType = productType;
        this.productName = productName;
        this.productCategory = productCategory;
        this.garmentVendorPo = garmentVendorPo;
        this.sSubLineId = sSubLineId;
        this.planProductionDate = planProductionDate;
        this.style = style;
        this.garmentPo = garmentPo;
        this.moNumber = moNumber;

    }
}