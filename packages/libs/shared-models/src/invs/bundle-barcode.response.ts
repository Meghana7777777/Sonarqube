import { GlobalResponseObject } from "../common/global-response-object";
import { KC_KnitJobBarcodeModel } from "../kms/knit-job.models";

export class BundlesBarcodeResponse extends GlobalResponseObject {
    barcodeInfo: KC_KnitJobBarcodeModel[];
    /**
         * Constructor for KC_KnitOrderJobsResponse
         * @param status - Status of the response
         * @param errorCode - Error code if applicable
         * @param internalMessage - Internal message for debugging
         * @param barcodeInfo - 
         */
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        barcodeInfo: KC_KnitJobBarcodeModel[],
    ) {
        super(status, errorCode, internalMessage); // Call parent constructor
        this.barcodeInfo = barcodeInfo;
    }
}