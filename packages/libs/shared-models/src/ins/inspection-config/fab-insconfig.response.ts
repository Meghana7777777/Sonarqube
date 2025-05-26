import { GlobalResponseObject } from "../../common";
import { InsFabInsConfigModel } from "./fab-insconfig.model";

export class InsFabInsConfigResponse extends GlobalResponseObject {
    data?: InsFabInsConfigModel[]
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: InsFabInsConfigModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}