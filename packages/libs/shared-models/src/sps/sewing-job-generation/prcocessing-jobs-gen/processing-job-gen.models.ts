import { CommonRequestAttrs, GlobalResponseObject } from "../../../common";
import { MOC_OpRoutingSubProcessList, ProcessTypeEnum } from "../../../oms";
import { SewingCreationOptionsEnum } from "../../enum";




export type GroupedProcessJobFeatureResult = {
    [key in typeof SewingCreationOptionsEnum[keyof typeof SewingCreationOptionsEnum]]?: string;
} & {
    moProductSubLineId?: string;
};



// Models for getting processing types for processing serials to display the tabs in processing jobs generation
export class PJ_ProcessingSerialRequest extends CommonRequestAttrs {
    processingSerial: number;
    processType?: ProcessTypeEnum;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        processingSerial: number,
        processType?: ProcessTypeEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.processingSerial = processingSerial;
        this.processType = processType;
    }
}

export class PJ_ProcessingTypesResponse extends GlobalResponseObject {
    data: PJ_ProcessingTypesResponseModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PJ_ProcessingTypesResponseModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class PJ_ProcessingTypesResponseModel { // bundel group missing
    processType: ProcessTypeEnum;
    processTypeDesc: string; 
    constructor(processType: ProcessTypeEnum, processTypeDesc: string) {
        this.processType = processType;
        this.processTypeDesc = processTypeDesc;
    }
}



// Models for getting Processing serial -> processing type -> processing jobs summary for processing serial (Header)
// Req: PJ_PoSerialRequest (need to send processing type)

export class PJ_ProcessingJobsSummaryResponse extends GlobalResponseObject {
    data: PJ_ProcessingJobsSummaryModel;

    /**
     * Constructor for PJ_ProcessingJobsSummaryResponse
     * @param status - Status of the response
     * @param errorCode - Error code, if any
     * @param internalMessage - Internal message
     * @param data - Summary data of processing jobs
     */
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: PJ_ProcessingJobsSummaryModel
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class PJ_ProcessingJobsSummaryModel {
    processingSerial: number;
    processType: ProcessTypeEnum;
    productFgQtyInfo: PJ_ProductFgColorQuantityModel[];

    /**
     * Constructor for PJ_ProcessingJobsSummaryModel
     * @param processingSerial - Serial number for processing
     * @param processType - Type of process
     * @param productFgQtyInfo - List of FG color quantity info
     */
    constructor(
        processingSerial: number,
        processType: ProcessTypeEnum,
        productFgQtyInfo: PJ_ProductFgColorQuantityModel[]
    ) {
        this.processingSerial = processingSerial;
        this.processType = processType;
        this.productFgQtyInfo = productFgQtyInfo;
    }
}

export class PJ_ProductFgColorQuantityModel {
    productCode: string;
    productType: string;
    productName: string;
    fgColor: string;
    sizeQtyInfo: PJ_sizeQuantityModel[];

    /**
     * Constructor for PJ_ProductFgColorQuantityModel
     * @param productCode - Code of the product
     * @param productType - Type of the product
     * @param productName - Name of the product
     * @param fgColor - FG color
     * @param sizeQtyInfo - Array of size and quantity models
     */
    constructor(
        productCode: string,
        productType: string,
        productName: string,
        fgColor: string,
        sizeQtyInfo: PJ_sizeQuantityModel[]
    ) {
        this.productCode = productCode;
        this.productType = productType;
        this.productName = productName;
        this.fgColor = fgColor;
        this.sizeQtyInfo = sizeQtyInfo;
    }
} export class PJ_sizeQuantityModel {
    size: string;
    originalQty: number;
    jobGeneratedQty: number;
    pendingQty: number;

    /**
     * Constructor for PJ_sizeQuantityModel
     * @param size - Size label
     * @param originalQty - Original quantity
     * @param jobGeneratedQty - Quantity generated for job
     * @param pendingQty - Remaining quantity
     */
    constructor(
        size: string,
        originalQty: number,
        jobGeneratedQty: number,
        pendingQty: number
    ) {
        this.size = size;
        this.originalQty = originalQty;
        this.jobGeneratedQty = jobGeneratedQty;
        this.pendingQty = pendingQty;
    }
}


// After user selected the features to get the summary related models
// Need to use PJ_BundleQtyEligibleBundleCountModel for suggesting sewing job quantity by calling common until function to give job qty suggestions

export class PJ_ProcessingSerialTypeAndFeatureGroupReq extends CommonRequestAttrs {
    processingSerial: number;
    processType: ProcessTypeEnum;
    groupOptions: SewingCreationOptionsEnum[];
    constructor(
        username: string, uniitCode: string, companyCode: string, userId: number, processingSerial: number, processType: ProcessTypeEnum, groupOptions: SewingCreationOptionsEnum[],) {
        super(username, uniitCode, companyCode, userId);
        this.processingSerial = processingSerial;
        this.processType = processType;
        this.groupOptions = groupOptions;
    }
}

export class PJ_ProcessingJobsSummaryForFeaturesResponse extends GlobalResponseObject {
    data: PJ_ProcessingJobSummaryForFeatureGroupModel[];

    /**
     * Constructor for PJ_ProcessingJobsSummaryForFeaturesResponse
     * @param status - Indicates success/failure
     * @param errorCode - Error code (if any)
     * @param internalMessage - Message for internal use
     * @param data - List of feature group job summaries
     */
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: PJ_ProcessingJobSummaryForFeatureGroupModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class PJ_ProcessingJobSummaryForFeatureGroupModel {
    processingSerial: number;
    processType: ProcessTypeEnum;
    groupInfo: GroupedProcessJobFeatureResult;
    productFgQtyInfo: PJ_ProductFgColorQuantityModel[];
    possibleBundleQtyInfo: PJ_BundleQtyEligibleBundleCountModel[];

    /**
     * Constructor for PJ_ProcessingJobSummaryForFeatureGroupModel
     * @param processingSerial - Unique serial for the process
     * @param processType - Enum type of the process
     * @param groupInfo - Grouped feature info
     * @param sizeQtyInfo - Size-wise quantity info
     * @param possibleBundleQtyInfo - Eligible bundle info
     */
    constructor(
        processingSerial: number,
        processType: ProcessTypeEnum,
        groupInfo: GroupedProcessJobFeatureResult,
        productFgQtyInfo: PJ_ProductFgColorQuantityModel[],
        possibleBundleQtyInfo: PJ_BundleQtyEligibleBundleCountModel[]
    ) {
        this.processingSerial = processingSerial;
        this.processType = processType;
        this.groupInfo = groupInfo;
        this.productFgQtyInfo = productFgQtyInfo;
        this.possibleBundleQtyInfo = possibleBundleQtyInfo;
    }
}


export class PJ_BundleQtyEligibleBundleCountModel {
    bundleQty: number;
    noOfEligibleBundles: number;

    constructor(bundleQty: number, noOfEligibleBundles: number) {
        this.bundleQty = bundleQty;
        this.noOfEligibleBundles = noOfEligibleBundles;
    }
}

// Once user clicks on Generate button need to call the below request and will the response as below
// Need to send the same for after user confirms the processing jobs as well in the pop up
export class PJ_ProcessingJobsGenRequest extends CommonRequestAttrs {
    processingSerial: number;
    processType: ProcessTypeEnum;
    multiColor: boolean;
    multiSize: boolean;
    sewingJobQty: number;
    groupInfo: GroupedProcessJobFeatureResult;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        processingSerial: number,
        processType: ProcessTypeEnum,
        multiColor: boolean,
        multiSize: boolean,
        sewingJobQty: number,
        groupInfo: GroupedProcessJobFeatureResult
    ) {
        super(username, unitCode, companyCode, userId);
        this.processingSerial = processingSerial;
        this.processType = processType;
        this.multiColor = multiColor;
        this.multiSize = multiSize;
        this.sewingJobQty = sewingJobQty;
        this.groupInfo = groupInfo;
    }
}

// Response for virtual jobs 
export class PJ_ProcessingJobPreviewModelResp extends GlobalResponseObject {
    data: PJ_ProcessingJobPreviewHeaderInfo;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PJ_ProcessingJobPreviewHeaderInfo) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

// This is the model for the combination of  Sewing job number + bundle size
export class PJ_ProcessingJobWisePreviewModel {
    jobNumber: string; // Sewing job number
    bundleSize: number;
    noOfBundles: number; // Number of bundles
    totalQuantity: number; // Total quantity
    bundleProps: PJ_BundlePropsModel; // Properties of the bundle (MO)
    bundleInfo: PJ_BundleExtractInfo[]

    constructor(
        jobNumber: string,
        bundleSize: number,
        noOfBundles: number,
        totalQuantity: number,
        bundleProps: PJ_BundlePropsModel,
        bundleInfo: PJ_BundleExtractInfo[]
    ) {
        this.jobNumber = jobNumber;
        this.bundleSize = bundleSize;
        this.noOfBundles = noOfBundles;
        this.totalQuantity = totalQuantity;
        this.bundleProps = bundleProps;
        this.bundleInfo = bundleInfo;
    }
}


export class PJ_BundlePropsModel {
    moNumbers: string;
    style: string;
    moLineNo: string;
    destination: string;
    plannedDelDate: string;
    planProdDate: string;
    planCutDate: string;
    coNumber: string;
    productName: string;
    fgColor: string;
    size: string;
}

export class PJ_ProcessingJobPreviewHeaderInfo {
    processingType: ProcessTypeEnum; // Processing type category
    totalNoOfJobs: number; // Total number of jobs
    totalJobQuantity: number; // Total quantity for the jobs
    totalBundlesCount: number; // Total count of bundles
    totalJobGroups: number; // Total number of job groups
    operations: string[]; // List of operations
    processingSerial: number;
    processingOrderDesc: string;
    multiColor: boolean;
    multiSize: boolean;
    jobWisePreviewModel: PJ_ProcessingJobWisePreviewModel[]; // Job-wise preview models
    processingJobsInfo: MOC_OpRoutingSubProcessList[]
    constructor(
        processingType: ProcessTypeEnum,
        totalNoOfJobs: number,
        totalJobQuantity: number,
        totalBundlesCount: number,
        totalJobGroups: number,
        operations: string[],
        processingSerial: number,
        processingOrderDesc: string,
        multiColor: boolean,
        multiSize: boolean,
        jobWisePreviewModel: PJ_ProcessingJobWisePreviewModel[],
        processingJobsInfo: MOC_OpRoutingSubProcessList[]

    ) {
        this.processingType = processingType;
        this.totalNoOfJobs = totalNoOfJobs;
        this.totalJobQuantity = totalJobQuantity;
        this.totalBundlesCount = totalBundlesCount;
        this.totalJobGroups = totalJobGroups;
        this.operations = operations;
        this.processingSerial = processingSerial;
        this.processingOrderDesc = processingOrderDesc;
        this.multiColor = multiColor;
        this.multiSize = multiSize;
        this.jobWisePreviewModel = jobWisePreviewModel;
        this.processingJobsInfo = processingJobsInfo;
    }
}


// Models for View Processing jobs
// Request is PJ_ProcessingSerialRequest
// Response as follows

export class PJ_ProcessingJobBatchInfoResp extends GlobalResponseObject {
    data: PJ_ProcessingJobBatchDetails[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PJ_ProcessingJobBatchDetails[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class PJ_ProcessingJobBatchDetails {
    sewingJobBatchNo: number;  // Sewing job batch number
    jobsGeneratedAt: string;  // Timestamp when the jobs were generated
    groupInfo: string;  // Group information for the batch
    multiColor: boolean;  // Flag indicating if the batch has multiple colors
    multiSize: boolean;  // Flag indicating if the batch has multiple sizes
    sewingJobQty: number;  // Quantity of sewing jobs in the batch
    logicalBundleQty: number;  // Quantity of logical bundles
    progress: number;  // Progress of the sewing job batch
    jobDetails: PJ_ProcessingJobLine[];  // Array of job line details associated with the batch
    processType: ProcessTypeEnum;
    constructor(
        sewingJobBatchNo: number,
        jobsGeneratedAt: string,
        groupInfo: string,
        multiColor: boolean,
        multiSize: boolean,
        sewingJobQty: number,
        logicalBundleQty: number,
        progress: number,
        jobDetails: PJ_ProcessingJobLine[],
        processType: ProcessTypeEnum
    ) {
        this.sewingJobBatchNo = sewingJobBatchNo;
        this.jobsGeneratedAt = jobsGeneratedAt;
        this.groupInfo = groupInfo;
        this.multiColor = multiColor;
        this.multiSize = multiSize;
        this.sewingJobQty = sewingJobQty;
        this.logicalBundleQty = logicalBundleQty;
        this.progress = progress;
        this.jobDetails = jobDetails;
        this.processType = processType;
    }
}

export class PJ_ProcessingJobLine {
    jobNo: string;  // Job number
    jobHeaderNo: number;  // Job header number
    jobType: string;  // Type of the job
    totalSmv: number;  // Total standard minute value
    isPlanned: boolean;  // Flag indicating if the job is planned
    moduleNo: string;  // Module number
    quantity: number;  // Quantity associated with the job
    multiColor: boolean;  // Flag indicating if the job involves multiple colors
    multiSize: boolean;  // Flag indicating if the job involves multiple sizes
    groupInfo: string;  // Group information related to the job
    subLines: PJ_ProcessingJobSubLine[];  // Array of sub-lines associated with the job

    constructor(
        jobNo: string,
        jobHeaderNo: number,
        jobType: string,
        totalSmv: number,
        isPlanned: boolean,
        moduleNo: string,
        quantity: number,
        multiColor: boolean,
        multiSize: boolean,
        groupInfo: string,
        subLines: PJ_ProcessingJobSubLine[]
    ) {
        this.jobNo = jobNo;
        this.jobHeaderNo = jobHeaderNo;
        this.jobType = jobType;
        this.totalSmv = totalSmv;
        this.isPlanned = isPlanned;
        this.moduleNo = moduleNo;
        this.quantity = quantity;
        this.multiColor = multiColor;
        this.multiSize = multiSize;
        this.groupInfo = groupInfo;
        this.subLines = subLines;
    }
}



export class PJ_ProcessingJobSubLine {
    productCode: string;
    productName: string;  // Name of the product
    productType: string;  // Type of the product
    size: string;  // Size of the product
    fgColor: string;  // Finished goods color
    quantity: number;  // Quantity of the sub-line product

    constructor(
        productCode: string,
        productName: string,
        productType: string,
        size: string,
        fgColor: string,
        quantity: number
    ) {
        this.productCode = productCode;
        this.productName = productName;
        this.productType = productType;
        this.size = size;
        this.fgColor = fgColor;
        this.quantity = quantity;
    }
}

export class PJ_BundleExtractInfo {
    bundleNumber: string;
    moProductSubLineId: number;
    productType: string;
    productName: string;
    fgColor: string;
    size: string;
    quantity: number;
    productCode: string;
    itemSku: string;

    constructor(
        bundleNumber: string,
        moProductSubLineId: number,
        productType: string,
        productName: string,
        fgColor: string,
        size: string,
        quantity: number,
        productCode: string,
        itemSku: string
    ) {
        this.bundleNumber = bundleNumber;
        this.moProductSubLineId = moProductSubLineId;
        this.productType = productType;
        this.productName = productName;
        this.fgColor = fgColor;
        this.size = size;
        this.quantity = quantity;
        this.productCode = productCode;
        this.itemSku = itemSku
    }
}




