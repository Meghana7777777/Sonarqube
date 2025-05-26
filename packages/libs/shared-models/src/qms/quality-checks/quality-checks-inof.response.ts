import { GlobalResponseObject } from "../../common";
import { QualityChecksInfoModel } from "./quality-checks-info.model";

export class QualityChecksInfoResponse extends GlobalResponseObject {
     data?: QualityChecksInfoModel[];
    
        constructor(status: boolean, errorCode: number, internalMessage: string, data: QualityChecksInfoModel[]) {
            super(status, errorCode, internalMessage);
            this.data = data;
        }
}