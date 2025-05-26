import { InsPacKListLevelInspectionAnalysis } from "./pack-list-insp-info-header.model";
import { GlobalResponseObject } from "../../../common";

export class InsPackListWiseInspInfoHeaderResponse extends GlobalResponseObject {
    data ?: InsPacKListLevelInspectionAnalysis;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: InsPacKListLevelInspectionAnalysis) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
