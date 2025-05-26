import { GlobalResponseObject } from "../../common";
import { OpCodeFgsInfo } from "./ops-fgs-info.model";

export class OpsFgsInfoResponse extends GlobalResponseObject {
    data: OpCodeFgsInfo[];

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
        data: OpCodeFgsInfo[]
    ) {
        super(status, errorCode, internalMessage); // Call the parent class constructor
        this.data = data;
    }
}
