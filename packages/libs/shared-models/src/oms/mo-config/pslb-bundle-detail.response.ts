import { GlobalResponseObject } from "../../common";
import { ProductSubLineAndBundleDetailModel } from "./pslb-bundle-detail.model";

/**
 * Represents the response object for eligible bundle information.
 */
export class ProductSubLineAndBundleDetailResponse extends GlobalResponseObject {
    data: ProductSubLineAndBundleDetailModel[];

    /**
     * Constructor for productSubLineAndBundleDetailResponse
     * @param status - Status of the response
     * @param errorCode - Error code if any
     * @param internalMessage - Internal message describing the response
     * @param data - Product sub-line and bundle detail model
     */
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: ProductSubLineAndBundleDetailModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
