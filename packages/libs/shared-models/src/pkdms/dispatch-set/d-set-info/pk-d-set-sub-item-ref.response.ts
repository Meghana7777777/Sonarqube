import { GlobalResponseObject } from "@xpparel/shared-models";
import { PkDSetModel } from "./pk-d-set.model";
import { PkDSetSubItemRefModel } from "./pk-d-set-sub-item-ref.model";

export class PkDSetSubItemRefResponse extends GlobalResponseObject {
    data: PkDSetSubItemRefModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PkDSetSubItemRefModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}