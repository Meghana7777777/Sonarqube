import { GlobalResponseObject } from "../../../common";
import { FgBarcodeScanResponseModel } from "./fg-barcode-scan-response.model";

export class CartonContainerConfirmationResponse extends GlobalResponseObject {
    data : FgBarcodeScanResponseModel;
    constructor(status: boolean, errorCode: number, internalMessage: string, data: FgBarcodeScanResponseModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}