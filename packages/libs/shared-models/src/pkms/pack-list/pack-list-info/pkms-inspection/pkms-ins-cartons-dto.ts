import { PackFinalInspectionStatusEnum } from "packages/libs/shared-models/src/pkms";
import { PKMSAttributesNamesAndValues, PKMSUploadedFiles } from "./get-insp-details-dto";

export class PKMSInsCartonsDto {
    ctnNo: string;
    poNo: string;
    style: string;
    color: string;
    sizeRatio: PkInsRatioModel[];
    cartonQty: number;
    destination: string;
    exFactory: string;
    packListNo: string;
    buyerAddress: string;
    packJobNumber: string;
    attributes?: PKMSAttributesNamesAndValues[];
    files: PKMSUploadedFiles;
    inspectionResult: PackFinalInspectionStatusEnum;
    insGrossWeight: number;
    insNetWeight: number;
    finalInspectionResult: PackFinalInspectionStatusEnum;
    packListId?: number;
    constructor(

        ctnNo: string,
        poNo: string,
        style: string,
        color: string,
        sizeRatio: PkInsRatioModel[],
        cartonQty: number,
        destination: string,
        exFactory: string,
        packListNo: string,
        buyerAddress: string,
        packJobNumber: string,
        attributes: PKMSAttributesNamesAndValues[],
        files: PKMSUploadedFiles,
        inspectionResult: PackFinalInspectionStatusEnum,
        insGrossWeight: number,
        insNetWeight: number,
        finalInspectionResult: PackFinalInspectionStatusEnum,
        packListId?: number,

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
    }
}


export class PkInsRatioModel {
    size: string;
    ratio: number;
    constructor(size: string, ratio: number) {
        this.size = size;
        this.ratio = ratio;
    }
}