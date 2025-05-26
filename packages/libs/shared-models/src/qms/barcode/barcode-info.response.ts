import { GlobalResponseObject } from "../../common";
import { QMS_BarcodeInfoModel } from "./barcode-info.model";

export class QMS_BarcodeInfoResponse extends GlobalResponseObject {
    data?: QMS_BarcodeInfoModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: QMS_BarcodeInfoModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}