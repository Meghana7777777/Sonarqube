import { GlobalResponseObject } from "../../common";
import { BarcodeDetails } from "./sewing-job-barcode-info.model";

export class SewingJobBarcodeInfoResp extends GlobalResponseObject {
    data: BarcodeDetails[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: BarcodeDetails[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}