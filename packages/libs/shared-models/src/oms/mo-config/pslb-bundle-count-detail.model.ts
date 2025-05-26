import { MC_BundleCountModel } from "./bundle-count-detail.model";

export class MC_ProductSubLineBundleCountDetail {
    moProductSubLineId: number;
    bundleCountDetail: MC_BundleCountModel[];

    /**
     * Constructor for MC_ProductSubLineBundleCountDetail
     * @param moProductSubLineId - Manufacturing Order Product Sub-Line ID
     * @param bundleCountDetail - Bundle count details
     */
    constructor(moProductSubLineId: number, bundleCountDetail: MC_BundleCountModel[]) {
        this.moProductSubLineId = moProductSubLineId;
        this.bundleCountDetail = bundleCountDetail;
    }
}
