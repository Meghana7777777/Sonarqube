import { DocGenStatusEnum } from "../enum";
import { PoMarkerModel } from "./marker";
import { PoRatioLineModel } from "./po-ratio-line.model";

export class PoRatioModel {
    id: number;
    poSerial: number;
    rName: string;
    rDesc: string;
    rCode: number;
    sharingRatio: boolean;
    sandwichRatio: boolean;
    plies: number;
    components: string[];
    markerInfo: PoMarkerModel;
    docGenStatus: DocGenStatusEnum;
    docGenOrder: number;
    // both sharingRatio and sandwichRatio can never be true. Only one of them will be true Else all will be false
    rLines: PoRatioLineModel[];
    logicalBundleQty: number;

    constructor(id: number,
        poSerial: number,
        rName: string,
        rDesc: string,
        rCode: number,
        sharingRatio: boolean,
        sandwichRatio: boolean,
        plies: number,
        docGenStatus: DocGenStatusEnum,
        docGenOrder: number,
        components: string[],
        rLines: PoRatioLineModel[],
        markerInfo: PoMarkerModel,
        logicalBundleQty: number
    ) {
        this.id = id;
        this.poSerial = poSerial;
        this.rName = rName;
        this.rDesc = rDesc;
        this.rCode = rCode;
        this.sharingRatio = sharingRatio;
        this.sandwichRatio = sandwichRatio;
        this.plies = plies;
        this.docGenStatus = docGenStatus;
        this.docGenOrder = docGenOrder;
        this.components = components;
        this.rLines = rLines;
        this.markerInfo = markerInfo;
        this.logicalBundleQty = logicalBundleQty;
    }
}