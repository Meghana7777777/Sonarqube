
import { OqPercentageModel } from "../oq-percentage.model";
import { PoLineOqUpdateModel } from "../po-line-oq-upate.model";


export class PoOqUpdateModel {
    poId: number;
    poSerial: number;
    remarks: string;
    oqLevelSelections: OqPercentageModel[];
    linesOqUpdate: PoLineOqUpdateModel[];
    oqUpatedOn: string; // the date time on which the order qty was updated

    constructor(
        poId: number,
        poSerial: number,
        remarks: string,
        oqLevelSelections: OqPercentageModel[],
        linesOqUpdate: PoLineOqUpdateModel[]
    ) {
        this.poId = poId;
        this.poSerial = poSerial;
        this.remarks = remarks;
        this.oqLevelSelections = oqLevelSelections;
        this.linesOqUpdate = linesOqUpdate;
    }
}
