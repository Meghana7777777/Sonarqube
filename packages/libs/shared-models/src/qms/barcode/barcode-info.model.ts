import { ProcessTypeEnum } from "../../oms";
import { QualityConfigurationInfoModel } from "../quality-configuration";
import { QualityTypeDto } from "../quality-type";

export class QMS_BarcodeAttributes {
    style: string;
    fgColor: string;
    productName: string;
    moNumber: string;
    moLineNo:string;
    size:string;
    plannedDelDate:string;
    planProdDate:string;
    planCutDate:string;
    jobNumber:string;
    fgSqu:string;
}

export class QMS_BarcodeInfoModel {
    barcode: string;
    lastReportedOn: string; // last reported date string 
    barcodeAttributes: QMS_BarcodeAttributes;
    qualityConfigurationInfo: QualityConfigurationInfoModel[];
    opGroups: QMS_BarcodeInfoOpGroupsModel[];

    constructor(
        barcode: string,
        lastReportedOn: string, // last reported date string 
        barcodeAttributes: QMS_BarcodeAttributes,
        qualityConfigurationInfo: QualityConfigurationInfoModel[],
        opGroups: QMS_BarcodeInfoOpGroupsModel[]
    ) {
        this.barcode = barcode   
        this.lastReportedOn = lastReportedOn;
        this.barcodeAttributes = barcodeAttributes;
        this.qualityConfigurationInfo = qualityConfigurationInfo;
        this.opGroups = opGroups;
    }
}

export class QMS_BarcodeInfoOpGroupsModel {
    opGroup: string;
    opCodes: string[];
    fgSku: string;
    barcodeQty: number;
    goodQty: number;
    rejectedQty: number;
    jobNumber: string;
    processType: ProcessTypeEnum;

    constructor(
        opGroup: string,
        opCodes: string[],
        fgSku: string,
        barcodeQty: number,
        goodQty: number,
        rejectedQty: number,
        jobNumber: string,
        processType: ProcessTypeEnum
    ) {
        this.opGroup = opGroup;
        this.opCodes = opCodes;
        this.fgSku = fgSku;
        this.barcodeQty = barcodeQty;
        this.goodQty = goodQty;
        this.rejectedQty = rejectedQty;
        this.jobNumber = jobNumber;
        this.processType = processType;
    }
}