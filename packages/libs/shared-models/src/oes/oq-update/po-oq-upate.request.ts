import { CommonRequestAttrs } from "../../common";
import { OrderTypeEnum } from "../enum/oq-type.enum";
import { OqPercentageModel } from "./oq-percentage.model";
import { PoLineOqUpdateModel } from "./po-line-oq-upate.model";

// export class PoOqUpdateRequest extends CommonRequestAttrs {
//     poSerial: number;
//     remarks: string;
//     poLineOqUpdateModel: PoLineOqUpdateModel[];
// }


export class PoOqUpdateRequest extends CommonRequestAttrs {
    poId: number;
    poSerial: number;
    remarks: string;
    oqLevelSelections: OqPercentageModel[];
    // This lines can be a combination of several ref keys. like schedule, color, style
    // or Mo-line, color
    // or only Mo-line
    linesOqUpdate: PoLineOqUpdateModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poId: number,
        poSerial: number,
        remarks: string,
        oqLevelSelections: OqPercentageModel[],
        linesOqUpdate: PoLineOqUpdateModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.poId = poId;
        this.poSerial = poSerial;
        this.remarks = remarks;
        this.oqLevelSelections = oqLevelSelections;
        this.linesOqUpdate = linesOqUpdate;
    }
}
