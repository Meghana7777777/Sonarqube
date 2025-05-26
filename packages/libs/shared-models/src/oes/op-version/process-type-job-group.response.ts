import { GlobalResponseObject } from "../../common";
import { ProcessTypeJobGroupModel } from "./process-type-job-group.model";

export class ProcessTypeGroupResp extends GlobalResponseObject  {
    data ?: ProcessTypeJobGroupModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ProcessTypeJobGroupModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
} 