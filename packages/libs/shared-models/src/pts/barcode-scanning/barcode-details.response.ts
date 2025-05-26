import { GlobalResponseObject } from "../../common";
import { BarcodeDetailsForBundleScanning } from "./barcode-scanning-models";

export class BarcodeDetailsResponse extends GlobalResponseObject {
    data: BarcodeDetailsForBundleScanning;

    /**
     * Constructor for BarcodeDetailsResponse
     * @param status - Indicates the success or failure of the response
     * @param errorCode - Error code associated with the response
     * @param internalMessage - Internal message providing more context about the response
     * @param data - Barcode details for bundle scanning
     */
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: BarcodeDetailsForBundleScanning
    ) {
        super(status, errorCode, internalMessage); // Call the parent class constructor
        this.data = data;
    }
}
