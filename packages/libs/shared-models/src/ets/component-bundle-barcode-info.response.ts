import { GlobalResponseObject } from "../common";
import { ComponentBundleBarCodeInfo } from "./barcode-response";


export class ComponentBundleBarCodeInfoResponse extends GlobalResponseObject {
    data: ComponentBundleBarCodeInfo[];

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
        data: ComponentBundleBarCodeInfo[]
    ) {
        super(status, errorCode, internalMessage); // Call the parent class constructor
        this.data = data;
    }
}
