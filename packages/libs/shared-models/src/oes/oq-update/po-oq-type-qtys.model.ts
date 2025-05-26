import { OrderTypeEnum } from "../enum/oq-type.enum";
import { OqPercentageModel } from "./oq-percentage.model";
import { PoSizeQtysModel } from "./po-size-qtys.model";

export class PoOqTypeQtysModel {
    oqPerc: OqPercentageModel;
    // Based on the grouping of ref1, ref2, ref3 the size level enetered qtys might be distributed accross multiple records 
    sizeQtys: PoSizeQtysModel[];

    constructor(oqPerc: OqPercentageModel, sizeQtys: PoSizeQtysModel[]) {
        this.oqPerc = oqPerc;
        this.sizeQtys = sizeQtys;
    }
}



