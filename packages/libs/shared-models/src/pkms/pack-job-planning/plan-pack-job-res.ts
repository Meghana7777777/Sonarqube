import { CommonRequestAttrs } from "../../common"
import { PackJobModel } from "../pack-list"

export class PlanPackJobModel extends CommonRequestAttrs {
    packTableId: number
    packJobs: PackJobModel[]
    constructor(
        packTableId: number,
        packJobs: PackJobModel[],
        companyCode: string,
        unitCode: string,
        username: string,
        userId: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.packTableId = packTableId
        this.packJobs = packJobs
    }
}