import { GlobalResponseObject } from "../../common";
import { SewingJobPriorityModel } from "./sewing-job-priority.model";

export class SewingJobPriorityResponse extends GlobalResponseObject {
    data: SewingJobPriorityModel[]
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: SewingJobPriorityModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}