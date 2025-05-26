import { CommonRequestAttrs } from "../../common";
import { PackJobModel } from "../pack-list";


export class unPlanRequest extends CommonRequestAttrs {
    packJobs: PackJobModel[];
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        packJobs: PackJobModel[],
    ) {
        super(username, unitCode, companyCode, userId);
        this.packJobs = packJobs
    }
}

