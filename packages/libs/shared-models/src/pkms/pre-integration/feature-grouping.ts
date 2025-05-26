import { PackSubLineInfo } from "./sub-line-info";

export class PackFeatureGrouping {
    moLine: string;
    cutSerial: string;
    deliveryDate: string;
    destination: string;
    PlannedCutDate: string;
    coLine: string;
    buyerPo: string;
    productType: string;
    productName: string;
    productCategory: string;
    garmentVendorPo: string;
    sFeatureGroupId: number;
    subLineInfo: PackSubLineInfo[];
    planProductionDate: string;


    constructor(
        moLine: string,
        deliveryDate: string,
        destination: string,
        PlannedCutDate: string,
        coLine: string,
        buyerPo: string,
        productType: string,
        productName: string,
        productCategory: string,
        garmentVendorPo: string,
        sFeatureGroupId: number,
        subLineInfo: PackSubLineInfo[],
        planProductionDate: string

    ) {

        this.moLine = moLine;
        this.deliveryDate = deliveryDate;
        this.destination = destination;
        this.PlannedCutDate = PlannedCutDate;
        this.coLine = coLine;
        this.buyerPo = buyerPo;
        this.productType = productType;
        this.productName = productName;
        this.productCategory = productCategory;
        this.garmentVendorPo = garmentVendorPo;
        this.sFeatureGroupId = sFeatureGroupId;
        this.subLineInfo = subLineInfo;
        this.planProductionDate = planProductionDate;

    }
}