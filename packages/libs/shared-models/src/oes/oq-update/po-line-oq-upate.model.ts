import { CommonRequestAttrs } from "../../common";
import { OqKeys } from "./oq-keys";
import { PoOqTypeQtysModel } from "./po-oq-type-qtys.model";


export class PoLineOqUpdateModel {
    ref1Key: OqKeys; // mo line
    ref2Key: OqKeys; // fg color // not used as of now
    ref3Key: OqKeys;    // not used as of now
    ref1Value: string; // po line id
    ref2Value: string; // not used as of now
    ref3Value: string; // not used as of now
    // for each such combination (lets say color + schedule) we have the WASTAGE/SAMPLE/EXT SHP level size wise qtys
    poLineQtys: PoOqTypeQtysModel[];

    constructor(
        ref1Key: OqKeys,
        ref2Key: OqKeys,
        ref3Key: OqKeys,
        ref1Value: string,
        ref2Value: string,
        ref3Value: string,
        poLineQtys: PoOqTypeQtysModel[]
    ) {
        this.ref1Key = ref1Key;
        this.ref2Key = ref2Key;
        this.ref3Key = ref3Key;
        this.ref1Value = ref1Value;
        this.ref2Value = ref2Value;
        this.ref3Value = ref3Value;
        this.poLineQtys = poLineQtys;
    }
}
