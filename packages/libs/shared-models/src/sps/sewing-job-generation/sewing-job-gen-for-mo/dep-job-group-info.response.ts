import { GlobalResponseObject } from "../../../common";
import { DependentJobGroupInfo } from "./sewing-job-props.model";

export class DepJobGroupInfoResp extends GlobalResponseObject {
    data: DependentJobGroupInfo[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DependentJobGroupInfo[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}