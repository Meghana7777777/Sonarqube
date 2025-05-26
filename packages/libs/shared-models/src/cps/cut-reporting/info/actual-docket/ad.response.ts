import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { ActualDocketBasicInfoModel } from ".";

export class AdResponse extends GlobalResponseObject {
    data ?: ActualDocketBasicInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ActualDocketBasicInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
