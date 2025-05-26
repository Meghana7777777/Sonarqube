
import { GlobalResponseObject } from "../../../common";
import { PackJobPlanningRequest } from "../../pack-job-planning";


export class PackingTableJobsResponse extends GlobalResponseObject {
    data?: PackJobPlanningRequest[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: PackJobPlanningRequest[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}