import { CommonRequestAttrs } from "../../common";
import { SewingJobPlanStatusEnum } from "../enum";

export class SewingJobNoRequest extends CommonRequestAttrs{
    jobNo: string;
    moduleCode: string;
    planInputDate: Date;
    status: SewingJobPlanStatusEnum
    constructor(username: string, unitCode: string, companyCode: string, userId: number, jobNo: string, moduleCode: string, planInputDate: Date, status: SewingJobPlanStatusEnum) {
        super(username, unitCode, companyCode, userId);
        this.jobNo = jobNo;
        this.moduleCode = moduleCode;
        this.planInputDate = planInputDate;
        this.status = status;
    }
}