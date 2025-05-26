import { GlobalResponseObject } from "../../../common";
import { QMS_DefectRatesModel } from "./defect-rates.model";

export class QMS_DefectRatesResponse extends GlobalResponseObject {
    data: QMS_DefectRatesModel[]


    constructor(status: boolean, errorCode: number, internalMessage: string, data: QMS_DefectRatesModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}