import { ProcessTypeEnum } from "../../oms";

export class SubLine {
    productName: string;  // Name of the product
    productType: string;  // Type of the product
    size: string;  // Size of the product
    fgColor: string;  // Finished goods color
    quantity: number;  // Quantity of the sub-line product

    constructor(
        productName: string,
        productType: string,
        size: string,
        fgColor: string,
        quantity: number
    ) {
        this.productName = productName;
        this.productType = productType;
        this.size = size;
        this.fgColor = fgColor;
        this.quantity = quantity;
    }
}

export class JobLine {
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
    subLines: SubLine[];  // Array of sub-lines associated with the job

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
        subLines: SubLine[]
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

export class SewingJobBatchDetails {
    sewingJobBatchNo: number;  // Sewing job batch number
    jobsGeneratedAt: string;  // Timestamp when the jobs were generated
    groupInfo: string;  // Group information for the batch
    multiColor: boolean;  // Flag indicating if the batch has multiple colors
    multiSize: boolean;  // Flag indicating if the batch has multiple sizes
    sewingJobQty: number;  // Quantity of sewing jobs in the batch
    logicalBundleQty: number;  // Quantity of logical bundles
    progress: number;  // Progress of the sewing job batch
    jobDetails: JobLine[];  // Array of job line details associated with the batch
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
        jobDetails: JobLine[],
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
