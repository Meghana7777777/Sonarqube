import { GlobalResponseObject } from "../../../common";
import { BarcodeScanResponseModel } from "../roll-pallet-allocation/barcode-scan-response.model";

export class BinPalletConfirmationResponse extends GlobalResponseObject {
    data ?: BarcodeScanResponseModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: BarcodeScanResponseModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}