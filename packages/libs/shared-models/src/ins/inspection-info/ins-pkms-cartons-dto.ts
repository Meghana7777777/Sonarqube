import { InsInspectionFinalInSpectionStatusEnum } from "@xpparel/shared-models";
import { PackFinalInspectionStatusEnum, InsPKMSAttributesNamesAndValues, PKMSUploadedFiles, PackingStatusEnum } from "packages/libs/shared-models/src/pkms";

export class InsPKMSInsCartonsDto {
    ctnNo: string;
    poNo: string;
    style: string;
    color: string;
    sizeRatio: InskInsRatioModel[];
    cartonQty: number;
    destination: string;
    exFactory: string;
    packListNo: string;
    buyerAddress: string;
    packJobNumber: string;
    attributes?: InsPKMSAttributesNamesAndValues[];
    files: PKMSUploadedFiles;
    inspectionResult: InsInspectionFinalInSpectionStatusEnum;
    insGrossWeight: number;
    insNetWeight: number;
    finalInspectionResult: InsInspectionFinalInSpectionStatusEnum;
    packListId?: number;
    cartons: string[];
    packOrderId: number;
    status?:PackingStatusEnum;
    constructor(

        ctnNo: string,
        poNo: string,
        style: string,
        color: string,
        sizeRatio: InskInsRatioModel[],
        cartonQty: number,
        destination: string,
        exFactory: string,
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
        packListId?: number,
        status?:PackingStatusEnum,



    ) {
        this.ctnNo = ctnNo;
        this.poNo = poNo;
        this.style = style;
        this.color = color;
        this.sizeRatio = sizeRatio;
        this.cartonQty = cartonQty;
        this.destination = destination;
        this.exFactory = exFactory;
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
        this.status=status;
    }
}


export class InskInsRatioModel {
    size: string;
    ratio: number;
    constructor(size: string, ratio: number) {
        this.size = size;
        this.ratio = ratio;
    }
}