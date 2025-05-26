import { GlobalResponseObject } from "../../common";
import { InsFgInsConfigModel } from "./fg-insconfig.model";

export class InsFgInsConfigResponse extends GlobalResponseObject {
    data?: InsFgInsConfigModel[]
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: InsFgInsConfigModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }

}