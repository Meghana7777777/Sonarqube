import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { RollInfoModel } from "../roll-info.model";
import { RollBasicInfoModel } from "./roll-basic-info.model";

export class RollBasicInfoResponse extends GlobalResponseObject {
    data: RollBasicInfoModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: RollBasicInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}