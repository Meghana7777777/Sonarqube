import { CommonRequestAttrs } from "../../../common";
import { GroupedSewingJobFeatureResult, SewingJobSummaryForSewingOrder } from "../sewing-job-gen-for-actuals.models";

export class SewingJobSummaryFeatureGroupForMo {
    sewingOrderId: number;
    sewingJobSummary: SewingJobSummaryForSewingOrder;
    groupInfo: GroupedSewingJobFeatureResult;

    constructor(sewingOrderId: number, sewingJobSummary: SewingJobSummaryForSewingOrder, groupInfo: GroupedSewingJobFeatureResult) {
        this.sewingOrderId = sewingOrderId;
        this.sewingJobSummary = sewingJobSummary;
        this.groupInfo = groupInfo;
    }
}

export class SewJobGenReqForBgMOAndFeatureGroup extends CommonRequestAttrs {
    sewingOrderId: number; // Unique ID for the sewing order
    groupInfo: GroupedSewingJobFeatureResult;
    multiColor: boolean; // Flag indicating if there are multiple colors
    multiSize: boolean; // Flag indicating if there are multiple sizes
    sewingJobQty: number;
    logicalBundleQty: number;
    bundleGroup: number;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        sewingOrderId: number,
        featureGroupDetails: GroupedSewingJobFeatureResult,
        multiColor: boolean,
        multiSize: boolean,
        sewingJobQty: number,
        logicalBundleQty: number,
        bundleGroup: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.sewingOrderId = sewingOrderId;
        this.groupInfo = featureGroupDetails;
        this.multiColor = multiColor;
        this.multiSize = multiSize;
        this.sewingJobQty = sewingJobQty;
        this.logicalBundleQty = logicalBundleQty;
        this.bundleGroup = bundleGroup;
    }
}

