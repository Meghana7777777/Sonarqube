export class MC_BundleCountModel {
    bundleQty: number;
    noOfEligibleBundles: number;

    /**
     * Constructor for MC_BundleCountModel
     * @param bundleQty - Total bundle quantity
     * @param noOfEligibleBundles - Number of eligible bundles
     */
    constructor(bundleQty: number, noOfEligibleBundles: number) {
        this.bundleQty = bundleQty;
        this.noOfEligibleBundles = noOfEligibleBundles;
    }
}
