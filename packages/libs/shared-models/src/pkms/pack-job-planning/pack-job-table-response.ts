import { GlobalResponseObject } from "../../common";
import { PackingTableJobsDto } from "./pack-job-planning-res-dto";

export class PackingTableJobsResponse extends GlobalResponseObject{
    data?:PackingTableJobsDto

    constructor(status: boolean, errorCode: number, internalMessage: string, data:PackingTableJobsDto) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }


}