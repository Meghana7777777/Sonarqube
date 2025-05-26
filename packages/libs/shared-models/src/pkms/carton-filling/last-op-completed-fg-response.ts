import { GlobalResponseObject } from "../../common";
import { LastOpCompletedFGsModel } from "./last-op-completed-fg-model";



export class LastOpCompletedFGsResponse extends GlobalResponseObject {
    data?: LastOpCompletedFGsModel;
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: LastOpCompletedFGsModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}