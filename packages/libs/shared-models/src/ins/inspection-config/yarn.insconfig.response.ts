import { InsThreadInsConfigModel, InsYarnInsConfigModel } from "@xpparel/shared-models";
import { GlobalResponseObject } from "../../common";
import { InsFabInsConfigModel } from "./fab-insconfig.model";

export class InsYarnInsConfigResponse extends GlobalResponseObject {
    data?: InsYarnInsConfigModel[]
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: InsYarnInsConfigModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}