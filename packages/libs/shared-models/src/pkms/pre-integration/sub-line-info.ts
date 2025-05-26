export class PackSubLineInfo {
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
    pkSubLineId: number;
    planProductionDate: string;
    style: string;

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
        pkSubLineId: number,
        planProductionDate: string,
        style: string
    ) {

        this.moLine = moLine;
        this.cutSerial = cutSerial;
        this.subLineId = subLineId;
        this.color = color;
        this.size = size;
        this.quantity = quantity;
        this.deliveryDate = deliveryDate;
        this.destination = destination;
        this.PlannedCutDate = PlannedCutDate;
        this.coLine = coLine;
        this.buyerPo = buyerPo;
        this.productType = productType;
        this.productName = productName;
        this.productCategory = productCategory;
        this.garmentVendorPo = garmentVendorPo;
        this.pkSubLineId = pkSubLineId;
        this.planProductionDate = planProductionDate;
        this.style = style;
    }
}