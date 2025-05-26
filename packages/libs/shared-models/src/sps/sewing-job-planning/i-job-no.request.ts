import { CommonRequestAttrs } from "../../common";

export class SewingIJobNoRequest extends CommonRequestAttrs {
    jobNo: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, jobNo: string) {
        super(username, unitCode, companyCode, userId);
        this.jobNo = jobNo;
    }
}

export class SpsBundleSheetRequest extends CommonRequestAttrs {
    jobNo: string;
    iNeedInventory: boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, jobNo: string, iNeedInventory: boolean) {
        super(username, unitCode, companyCode, userId);
        this.jobNo = jobNo;
        this.iNeedInventory = iNeedInventory;
    }
}