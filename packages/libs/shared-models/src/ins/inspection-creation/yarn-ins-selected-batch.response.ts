import { GlobalResponseObject } from "../../common";

export class YarnInsSelectedBatchResponse extends GlobalResponseObject {
    data: YarnInsSelectedBatchModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: YarnInsSelectedBatchModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class YarnInsSelectedBatchModel {
    packListId: number;
    batchNo: string;
    attrs: YarnInsSelectedBatchModelAttrs;
    lotInfo: YarnInsSelectedLotModel[];
    constructor(
        packListId: number,
        batchNo: string,
        attrs: YarnInsSelectedBatchModelAttrs,
        lotInfo: YarnInsSelectedLotModel[],
    ) {
        this.packListId = packListId;
        this.batchNo = batchNo;
        this.attrs = attrs;
        this.lotInfo = lotInfo;
    }
}

export class YarnInsSelectedBatchModelAttrs {
    moNo: string[];
    delDate: string[];
    destination: string[];
    moLines: string[];
}

export class YarnInsSelectedLotModel {
    packListId: number;
    lotNo: string;
    cones: YarnInsSelectedConeModel[]; // Changed from spools to cones/hanks
    attrs: YarnInsSelectedLotModelAttrs;
    constructor(
        packListId: number,
        lotNo: string,
        cones: YarnInsSelectedConeModel[],  // Updated here
        attrs: YarnInsSelectedLotModelAttrs,
    ) {
        this.packListId = packListId;
        this.lotNo = lotNo;
        this.cones = cones;  // Updated here
        this.attrs = attrs;
    }
}

export class YarnInsSelectedConeModel {  // Updated class name for Yarn
    packListId: number;
    coneId: number;  // Changed from spoolId
    coneBarcode: string;  // Changed from spoolBarcode
    yarnLength: number;  // Changed from spoolLength (measured in meters/yards)
    attrs: YarnInsSelectedConeModelAttrs;  // Updated attributes
    constructor(
        packListId: number,
        coneId: number,
        coneBarcode: string,
        yarnLength: number,
        attrs: YarnInsSelectedConeModelAttrs,
    ) {
        this.packListId = packListId;
        this.coneId = coneId;
        this.coneBarcode = coneBarcode;
        this.yarnLength = yarnLength;
        this.attrs = attrs;
    }
}

export class YarnInsSelectedConeModelAttrs {  // Updated attributes specific to Yarn inspection
    twistPerInch: number;  // Number of twists per inch
    tensileStrength: number;  // Measured in cN/tex
    elongation: number;  // Stretchability in %
    hairiness: number;  // Fiber looseness level
    moistureContent: number;  // Yarn moisture retention (Replaces lubrication)
    constructor(
        twistPerInch: number,
        tensileStrength: number,
        elongation: number,
        hairiness: number,
        moistureContent: number,
    ) {
        this.twistPerInch = twistPerInch;
        this.tensileStrength = tensileStrength;
        this.elongation = elongation;
        this.hairiness = hairiness;
        this.moistureContent = moistureContent;
    }
}

export class YarnInsSelectedLotModelAttrs {
    coneCount: number;  // Changed from spoolCount to coneCount
    constructor(coneCount: number) {
        this.coneCount = coneCount;
    }
}
