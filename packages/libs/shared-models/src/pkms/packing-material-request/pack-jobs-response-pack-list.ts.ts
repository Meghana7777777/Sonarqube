import { GlobalResponseObject } from "../../common";
import { PackJobResponseModel } from "./pack-job-response-model";

export class PackJobsResponseForPackList extends GlobalResponseObject {
    data: PackJobResponseModel
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data: PackJobResponseModel
    ) {
        super(status, errorCode, internalMessage)
        this.data = data
    }
}