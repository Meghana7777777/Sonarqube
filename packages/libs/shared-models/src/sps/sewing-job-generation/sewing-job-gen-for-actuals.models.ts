// 1. sewing job summary info for the sewing order

import { CommonRequestAttrs } from "../../common";
import { SewingCreationOptionsEnum } from "../enum";

// Pay load
export class SewingOrderReq extends CommonRequestAttrs {
    sewingOrderId: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, sewingOrderId: number) {
        super(username, unitCode, companyCode, userId);
        this.sewingOrderId = sewingOrderId;
    }
}

// Response
export class SewingJobSummaryForSewingOrder{
    sewingOrderId: number; // Unique ID for the sewing order
    sewingOrderName: string; // Name of the sewing order
    orderNo: string; // Order number
    sewingOrderSerial: number; // Serial number of the sewing order
    sewingOrderLineInfo: SewingOrderLineInfo[]; // Array of sewing order line information
 
    constructor(
        sewingOrderId: number,
        sewingOrderName: string,
        orderNo: string,
        sewingOrderSerial: number,
        sewingOrderLineInfo: SewingOrderLineInfo[]
    ) {
        this.sewingOrderId = sewingOrderId;
        this.sewingOrderName = sewingOrderName;
        this.orderNo = orderNo;
        this.sewingOrderSerial = sewingOrderSerial;
        this.sewingOrderLineInfo = sewingOrderLineInfo;
    }
}

export class SewingOrderLineInfo {
    sewingOrderLineId: number; // Unique ID for the sewing order line
    orderLineNo: string; // Order line number
    productType: string; // Type of the product (e.g., garment, accessory)
    productName: string; // Name of the product (e.g., T-Shirt, Jeans)
    fgColor: string; // Finished goods color (e.g., Red, Blue)
    sizeQtyDetails: SizeQtyDetails[]; // Array of size and quantity details for the order line

    constructor(
        sewingOrderLineId: number,
        orderLineNo: string,
        productType: string,
        productName: string,
        fgColor: string,
        sizeQtyDetails: SizeQtyDetails[]
    ) {
        this.sewingOrderLineId = sewingOrderLineId;
        this.orderLineNo = orderLineNo;
        this.productType = productType;
        this.productName = productName;
        this.fgColor = fgColor;
        this.sizeQtyDetails = sizeQtyDetails;
    }
}


export class SizeQtyDetails {
    size: string; // Size of the product
    originalQty: number; // Original quantity
    sewGeneratedQty: number; // Quantity generated in sewing
    pendingQty: number; // Pending quantity
    cutFgNumbers: number[];
    sewFgNumber: number[];

    constructor(size: string, originalQty: number, sewGeneratedQty: number, pendingQty: number, cutFgNumbers: number[],  sewFgNumber: number[]) {
        this.size = size;
        this.originalQty = originalQty;
        this.sewGeneratedQty = sewGeneratedQty;
        this.pendingQty = pendingQty;
        this.cutFgNumbers = cutFgNumbers;
        this.sewFgNumber = sewFgNumber;
    }
}

// once user clicks on the get details button after selecting features 

// 2. To get sewing order details to generate sewing jobs

// Payload
export class SewingJobFeatureGroupReq extends CommonRequestAttrs {
    sewSerial: number; // Unique ID for the sewing order
    isForEntireSewingOrder: boolean; // Flag to indicate if the request is for the entire sewing order
    sewingJobGenGroupOptions: SewingCreationOptionsEnum[]; // Array of options for sewing job generation groups
    needDocketBundleWiseInfo: boolean;
    bundleGroup : number;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        sewSerial: number,
        isForEntireSewingOrder: boolean,
        sewingJobGenGroupOptions: SewingCreationOptionsEnum[],
        needDocketBundleWiseInfo: boolean,
        bundleGroup: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.sewSerial = sewSerial;
        this.isForEntireSewingOrder = isForEntireSewingOrder;
        this.sewingJobGenGroupOptions = sewingJobGenGroupOptions;
        this.needDocketBundleWiseInfo = needDocketBundleWiseInfo;
        this.bundleGroup = bundleGroup;
    }
}


// Response
// Main class
export class SewingOrderDetailsForGivenFeatureGroup {
    sewingOrderId: number;
    featureGroupDetails: FeatureGroupDetails[];

    constructor(sewingOrderId: number, featureGroupDetails: FeatureGroupDetails[]) {
        this.sewingOrderId = sewingOrderId;
        this.featureGroupDetails = featureGroupDetails;
    }
}

// Feature group details class
export class FeatureGroupDetails {
    groupInfo: GroupedSewingJobFeatureResult;
    cutInfo: CutInfo[];
    constructor(groupInfo: GroupedSewingJobFeatureResult, cutInfo: CutInfo[]) {
        this.groupInfo = groupInfo;
        this.cutInfo = cutInfo;
    }
}

// Cut info class
export class CutInfo {
    featureDetails: GroupedSewingJobFeatureResult;
    cutSerial: number;
    cutDetails: CutDetails[];

    constructor(featureDetails: GroupedSewingJobFeatureResult, cutSerial: number, cutDetails: CutDetails[]) {
        this.featureDetails = featureDetails;
        this.cutSerial = cutSerial;
        this.cutDetails = cutDetails;
    }
}

// Cut details class
export class CutDetails {
    cutNumber: number;
    cgDetails: CGDetails[];
    productName: string;
    productType: string;
    moLine: string;
    deliveryDate: string;
    destination: string;
    planProductionDate: string;
    planCutDate: string;
    constructor(cutNumber: number, cgDetails: CGDetails[],  productName: string, productType: string, moLine: string, deliveryDate: string, destination: string, planProductionDate: string, planCutDate: string) {
        this.cutNumber = cutNumber;
        this.cgDetails = cgDetails;
        this.productName = productName;
        this.productType = productType;
        this.moLine = moLine;
        this.deliveryDate = deliveryDate;
        this.destination = destination;
        this.planProductionDate = planProductionDate;
        this.planCutDate = planCutDate;
    }
}

// CG details class
export class CGDetails {
    cgName: string;
    isMainCg: boolean;
    docketDetails: DocketDetails[];

    constructor(cgName: string, isMainCg: boolean,  docketDetails: DocketDetails[]) {
        this.cgName = cgName;
        this.isMainCg = isMainCg;
        this.docketDetails = docketDetails;
    }
}

// Docket details class
export class DocketDetails {
    docketNumber: string;
    color: string;
    sizeQtyDetails: SizeQtyDetails[];
    docketBundleInfo: DocketBundleInfo[];

    constructor(docketNumber: string, color: string, sizeQtyDetails: SizeQtyDetails[], docketBundleInfo: DocketBundleInfo[]) {
        this.docketNumber = docketNumber;
        this.color = color;
        this.sizeQtyDetails = sizeQtyDetails;
        this.docketBundleInfo = docketBundleInfo;
    }
}

// Docket bundle info class
export class DocketBundleInfo {
    bundleNumber: string;
    sizeQtyDetails: SizeQtyDetails;

    constructor(bundleNumber: string, sizeQtyDetails: SizeQtyDetails) {
        this.bundleNumber = bundleNumber;
        this.sizeQtyDetails = sizeQtyDetails;
    }
}

// 3. Once user clicks on submit button against to each feature group  need to send pay load
// PayLoad
export class SewJobGenReqForActualAndFeatureGroup extends CommonRequestAttrs {
    sewingOrderId: number; // Unique ID for the sewing order
    groupInfo: GroupedSewingJobFeatureResult;
    multiColor: boolean; // Flag indicating if there are multiple colors
    multiSize: boolean; // Flag indicating if there are multiple sizes
    sewingJobQty: number;
    logicalBundleQty: number;

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
        logicalBundleQty: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.sewingOrderId = sewingOrderId;
        this.groupInfo = featureGroupDetails;
        this.multiColor = multiColor;
        this.multiSize = multiSize;
        this.sewingJobQty = sewingJobQty;
        this.logicalBundleQty = logicalBundleQty;
    }
}

// Response to show the preview and submit
export class SewingJobPreviewForActualGenFeatureGroup {
    sewingOrderId: number; // Unique ID for the sewing order
    groupInfo: GroupedSewingJobFeatureResult; // Group information for sewing creation options
    sewingJobInfo: SewingJobInfoModel[];
    sewingJobQty: number;
    logicalBundleQty: number;
    constructor(
        sewingOrderId: number,
        groupInfo: GroupedSewingJobFeatureResult,
        sewingJobInfo: SewingJobInfoModel[],
        sewingJobQty: number,
        logicalBundleQty: number
    ) {
        this.sewingOrderId = sewingOrderId;
        this.groupInfo = groupInfo;
        this.sewingJobInfo = sewingJobInfo;
        this.sewingJobQty = sewingJobQty;
        this.logicalBundleQty = logicalBundleQty;
    }
}


// 4. Once user clicks on confirm and submit need to send the same info as payload to create sewing jobs
// payload
export class SewingJobConfirmedReqInfoForActualGenFeatureGroup extends CommonRequestAttrs {
    sewingOrderId: number; // Unique ID for the sewing order
    groupInfo: GroupedSewingJobFeatureResult; // Group information for sewing creation options
    sewingJobInfo: SewingJobInfoModel[];
    sewingJobQty: number;
    logicalBundleQty: number;
    multiColor: boolean;
    multiSize: boolean;
    
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        sewingOrderId: number,
        groupInfo: GroupedSewingJobFeatureResult,
        sewingJobInfo: SewingJobInfoModel[],
        sewingJobQty: number,
        logicalBundleQty: number,
        multiColor: boolean,
        multiSize: boolean,
    ) {
        super(username, unitCode, companyCode, userId);
        this.sewingOrderId = sewingOrderId;
        this.groupInfo = groupInfo;
        this.sewingJobInfo = sewingJobInfo;
        this.sewingJobQty = sewingJobQty;
        this.logicalBundleQty = logicalBundleQty;
        this.multiColor = multiColor;
        this.multiSize = multiSize;
    }
}


export class SewingJobInfoModel {
    sewingJobNumber: string; // Job number for the sewing job
    featureGroupDetails: FeatureGroupDetails; // Array of feature group details for the job
    cutNumber: string; // The associated cut string for the sewing job
    cutSerial: string; // Purchase order serial number

    constructor(
        sewingJobNumber: string,
        featureGroupDetails: FeatureGroupDetails,
        cutNumber: string,
        cutSerial: string
    ) {
        this.sewingJobNumber = sewingJobNumber; // Initialize sewing job number
        this.featureGroupDetails = featureGroupDetails; // Initialize feature group details
        this.cutNumber = cutNumber; // Initialize cut number
        this.cutSerial = cutSerial; // Initialize PO serial number
    }
}



export type GroupedSewingJobFeatureResult = {
    [key in typeof SewingCreationOptionsEnum[keyof typeof SewingCreationOptionsEnum]]?: string;
} & {
    mo_product_sub_line_id?: string;
};

// Response -> Common Response Object







