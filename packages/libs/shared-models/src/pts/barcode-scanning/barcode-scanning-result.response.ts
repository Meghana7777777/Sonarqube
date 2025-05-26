import { GlobalResponseObject } from "../../common";
import { BarcodeScanningStatusModel } from "./barcode-scanning-models";

export class BarcodeScanningResultResponse extends GlobalResponseObject {
    data: BarcodeScanningStatusModel;

    /**
     * Constructor for BarcodeScanningResultResponse
     * @param status - Indicates the success or failure of the response
     * @param errorCode - Error code associated with the response
     * @param internalMessage - Internal message providing more context about the response
     * @param data - Barcode scanning status details
     */
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: BarcodeScanningStatusModel
    ) {
        super(status, errorCode, internalMessage); // Call the parent class constructor
        this.data = data;
    }
}
