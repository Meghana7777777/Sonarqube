/**
 * Represents the response object for eligible bundle information.
*/
export class ProductSubLineAndBundleDetailModel {
    moProductSubLineId: number;
    bundleDetails: MOC_BundleDetail[];

    constructor(moProductSubLineId: number, bundleDetails: MOC_BundleDetail[]) {
        this.moProductSubLineId = moProductSubLineId;
        this.bundleDetails = bundleDetails;
    }
}

/**
 * Represents details of a bundle, including its number and quantity.
 */
export class MOC_BundleDetail {
    bundleNumber: string;
    quantity: number;
    itemSku: string;
    pslId: number;

    constructor(bundleNumber: string, quantity: number, itemSku: string,  pslId: number) {
        this.bundleNumber = bundleNumber;
        this.quantity = quantity;
        this.itemSku = itemSku;
        this.pslId = pslId;
    }
}