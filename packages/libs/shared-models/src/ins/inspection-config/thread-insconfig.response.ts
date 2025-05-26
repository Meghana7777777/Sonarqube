import { InsThreadInsConfigModel } from "@xpparel/shared-models";
import { GlobalResponseObject } from "../../common";
import { InsFabInsConfigModel } from "./fab-insconfig.model";

export class InsThreadInsConfigResponse extends GlobalResponseObject {
    data?: InsThreadInsConfigModel[]
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: InsThreadInsConfigModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}