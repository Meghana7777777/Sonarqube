import { OslIdFgsSpsModel } from "../fg-creation";


export class JobBundleFgInfoModel {
    jobNumber: string; // Job number
    jobBarcode: string; // Job barcode
    fgs: number[]; // Finished goods information
    bundlesInfo: BundleFgModel[]; // Bundles information
    jobGroup: number; // Job group ID
    operations: string[]; // Operations associated with the job
    jobQty: number;
    sewSerial: number;
    
    constructor(
        jobNumber: string,
        jobBarcode: string,
        fgs: number[],
        bundlesInfo: BundleFgModel[],
        jobGroup: number,
        operations: string[],
        jobQty: number,
        sewSerial: number
    ) {
        this.jobNumber = jobNumber;
        this.jobBarcode = jobBarcode;
        this.fgs = fgs;
        this.bundlesInfo = bundlesInfo;
        this.jobGroup = jobGroup;
        this.operations = operations;
        this.jobQty = jobQty;
        this.sewSerial = sewSerial;
    }
}



export class BundleFgModel {
    bundleBarcode: string;
    oslIdFgsModel: OslIdFgsSpsModel[];
    
    constructor(bundleBarcode: string, oslIdFgsModel: OslIdFgsSpsModel[]) {
        this.bundleBarcode = bundleBarcode;
        this.oslIdFgsModel = oslIdFgsModel;
    }
}


