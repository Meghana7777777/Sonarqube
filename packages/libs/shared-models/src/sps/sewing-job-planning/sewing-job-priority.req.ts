import { CommonRequestAttrs } from "../../common";

export class SewingJobPriorityRequest extends CommonRequestAttrs {
    moduleCode: string;
    jobNo: string[];
    jobPriority: number[] 
    constructor( username: string, unitCode: string, companyCode: string, userId: number,   moduleCode: string, jobNo: string[], jobPriority: number[] ) {
        super(username, unitCode, companyCode, userId);
        this.moduleCode = moduleCode;
        this.jobNo = jobNo;
        this.jobPriority = jobPriority;
    }
}