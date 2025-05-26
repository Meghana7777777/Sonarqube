import { GlobalResponseObject } from "../../../common";
import { PackJobModel } from "./pack-jobs.model";

export class PackJobsResponse extends GlobalResponseObject {
    data: PackJobModel[]
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string, data: PackJobModel[]
    ) {
        super(status, errorCode, internalMessage)
        this.data = data
    }
}