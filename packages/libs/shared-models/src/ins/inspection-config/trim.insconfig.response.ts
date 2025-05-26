import { GlobalResponseObject } from "../../common";
import { InsFgInsConfigModel, InsTrimInsConfigModel } from "./fg-insconfig.model";

export class InsTrimInsConfigResponse extends GlobalResponseObject {
    data?: InsTrimInsConfigModel[]
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: InsTrimInsConfigModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }

}