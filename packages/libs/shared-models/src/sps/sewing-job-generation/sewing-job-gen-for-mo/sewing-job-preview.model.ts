import { ProcessTypeEnum } from "../../../oms";
import { MoPropsModel } from "./mo-props.model";

export class SewingJobWisePreviewModel {
    sewingJobNumber: string; // Sewing job number
    noOfBundles: number; // Number of bundles
    totalQuantity: number; // Total quantity
    bundleProps: MoPropsModel; // Properties of the bundle (MO)
    constructor(
        sewingJobNumber: string,
        noOfBundles: number,
        totalQuantity: number,
        bundleProps: MoPropsModel,
        
    ) {
        this.sewingJobNumber = sewingJobNumber;
        this.noOfBundles = noOfBundles;
        this.totalQuantity = totalQuantity;
        this.bundleProps = bundleProps;
       
    }
}


export class SewingJobPreviewHeaderInfo {
    processingType: ProcessTypeEnum; // Processing type category
    totalNoOfJobs: number; // Total number of jobs
    totalJobQuantity: number; // Total quantity for the jobs
    totalBundlesCount: number; // Total count of bundles
    totalJobGroups: number; // Total number of job groups
    operations: string[]; // List of operations
    sewSerial: number;
    sewOrderDesc: string;
    multiColor: boolean;
    multiSize: boolean;
    jobWisePreviewModel: SewingJobWisePreviewModel[]; // Job-wise preview models
    logicalBundleQty: number;


    constructor(
        processingType: ProcessTypeEnum,
        totalNoOfJobs: number,
        totalJobQuantity: number,
        totalBundlesCount: number,
        totalJobGroups: number,
        operations: string[],
        sewSerial: number,
        sewOrderDesc: string,
        multiColor: boolean,
        multiSize: boolean,
        jobWisePreviewModel: SewingJobWisePreviewModel[],
        logicalBundleQty: number,
        
    ) {
        this.processingType = processingType;
        this.totalNoOfJobs = totalNoOfJobs;
        this.totalJobQuantity = totalJobQuantity;
        this.totalBundlesCount = totalBundlesCount;
        this.totalJobGroups = totalJobGroups;
        this.operations = operations;
        this.sewSerial = sewSerial;
        this.sewOrderDesc = sewOrderDesc;
        this.multiColor = multiColor;
        this.multiSize = multiSize;
        this.jobWisePreviewModel = jobWisePreviewModel;
        this.logicalBundleQty = logicalBundleQty;
    }
}
