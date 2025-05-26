export class CutPanelInfoForSewJob {
    jobNumber: string;
    cutEligibleQty: number;
    cutPanelDetails: CutPanelDetailsModel[]
}

export class CutPanelDetailsModel {
    cutBundleNumber: string;
    poSerial: number;
    cutNumber: number;
    productName: string;
    fgColor: string;
    size: string;
    docketNumber: number;
    componentName: string;
    cutEligibleQty: number;
}