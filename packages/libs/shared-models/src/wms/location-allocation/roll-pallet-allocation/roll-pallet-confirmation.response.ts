import { GlobalResponseObject } from "../../../common";
import { BarcodeScanResponseModel } from "./barcode-scan-response.model";

export class RollPalletConfirmationResponse extends GlobalResponseObject {
    data : BarcodeScanResponseModel;
    constructor(status: boolean, errorCode: number, internalMessage: string, data: BarcodeScanResponseModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}