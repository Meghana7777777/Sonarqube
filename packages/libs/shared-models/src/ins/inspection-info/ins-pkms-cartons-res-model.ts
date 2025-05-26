import { InsInspectionFinalInSpectionStatusEnum } from "@xpparel/shared-models";
import { PackFinalInspectionStatusEnum, InsPKMSAttributesNamesAndValues, PKMSUploadedFiles } from "packages/libs/shared-models/src/pkms";

export class InsPKMSInsCartonsResModel {
    ctnNo: string;
    destination: string;//no
    packListNo: string;
    buyerAddress: string; //no
    packJobNumber: string;
    attributes?: InsPKMSAttributesNamesAndValues[];
    files: PKMSUploadedFiles;
    inspectionResult: InsInspectionFinalInSpectionStatusEnum;
    insGrossWeight: number;
    insNetWeight: number;
    finalInspectionResult: InsInspectionFinalInSpectionStatusEnum;
    packListId: number;
    cartons: string[];
    packOrderId: number;
    constructor(
        ctnNo: string,
        destination: string,
        packListNo: string,
        buyerAddress: string,
        packJobNumber: string,
        attributes: InsPKMSAttributesNamesAndValues[],
        files: PKMSUploadedFiles,
        inspectionResult: InsInspectionFinalInSpectionStatusEnum,
        insGrossWeight: number,
        insNetWeight: number,
        finalInspectionResult: InsInspectionFinalInSpectionStatusEnum,
        cartons: string[],
        packOrderId: number,
        packListId: number,
    ) {
        this.ctnNo = ctnNo;
        this.destination = destination;
        this.packListNo = packListNo;
        this.buyerAddress = buyerAddress;
        this.packJobNumber = packJobNumber;
        this.attributes = attributes;
        this.files = files;
        this.inspectionResult = inspectionResult;
        this.insGrossWeight = insGrossWeight;
        this.insNetWeight = insNetWeight;
        this.finalInspectionResult = finalInspectionResult;
        this.packListId = packListId;
        this.cartons = cartons;
        this.packOrderId = packOrderId;
    }
}


export class InskInsRatioResModel {
    size: string;
    ratio: number;
    constructor(size: string, ratio: number) {
        this.size = size;
        this.ratio = ratio;
    }
}