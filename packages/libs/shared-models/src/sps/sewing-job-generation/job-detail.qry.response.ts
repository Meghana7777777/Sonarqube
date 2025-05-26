import { ProcessTypeEnum } from "../../oms";

export class JobDetailQueryResponse {
    jobPrefId: number;         // ID of the job preference
    groupInfo: string;         // Group information
    multiColor: boolean;       // Indicates if the job involves multiple colors
    multiSize: boolean;        // Indicates if the job involves multiple sizes
    sewingJobQty: number;      // Sewing job quantity
    logicalBundleQty: number;  // Logical bundle quantity
    jobHeaderId: number;       // ID of the job header
    jobGroupId: number;        // ID of the job group
    jobNo: string;             // Job number
    jobType: ProcessTypeEnum;           // Type of the job
    smv: number;               // Standard minute value
    moduleNo: string;          // Module number
    productName: string;       // Name of the product
    color: string;             // Color of the product
    size: string;              // Size of the product
    qty: number;               // Quantity of the product
    createdAt: string;

    constructor(
        jobPrefId: number,
        groupInfo: string,
        multiColor: boolean,
        multiSize: boolean,
        sewingJobQty: number,
        logicalBundleQty: number,
        jobHeaderId: number,
        jobGroupId: number,
        jobNo: string,
        jobType: ProcessTypeEnum,
        smv: number,
        moduleNo: string,
        productName: string,
        color: string,
        size: string,
        qty: number,
        createdAt: string
    ) {
        this.jobPrefId = jobPrefId;
        this.groupInfo = groupInfo;
        this.multiColor = multiColor;
        this.multiSize = multiSize;
        this.sewingJobQty = sewingJobQty;
        this.logicalBundleQty = logicalBundleQty;
        this.jobHeaderId = jobHeaderId;
        this.jobGroupId = jobGroupId;
        this.jobNo = jobNo;
        this.jobType = jobType;
        this.smv = smv;
        this.moduleNo = moduleNo;
        this.productName = productName;
        this.color = color;
        this.size = size;
        this.qty = qty;
        this.createdAt = createdAt;
    }
}
