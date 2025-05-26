import { DocketPanelDetailsDto } from "./doc-bundle-info-for-fgs.model";

export class ColorSizeCutPanelInfo {
    jobNumber: string; // Job number for the sewing job
    fgColor: string; // Finished goods color
    size: string; // Size of the product
    productName: string; // Name of the product
    cutEligibleQty: number; // Quantity eligible for cutting
    requiredQty: number; // Required quantity for the order
    cutBundleInfo: DocketPanelDetailsDto[]; // Array of Docket panel details

    constructor(
        jobNumber: string,
        fgColor: string,
        size: string,
        productName: string,
        cutEligibleQty: number,
        requiredQty: number,
        cutBundleInfo: DocketPanelDetailsDto[]
    ) {
        this.jobNumber = jobNumber;
        this.fgColor = fgColor;
        this.size = size;
        this.productName = productName;
        this.cutEligibleQty = cutEligibleQty;
        this.requiredQty = requiredQty;
        this.cutBundleInfo = cutBundleInfo;
    }
}
