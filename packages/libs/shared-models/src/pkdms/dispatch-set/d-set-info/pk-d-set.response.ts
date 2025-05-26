import { GlobalResponseObject } from "@xpparel/shared-models";
import { PkDSetModel } from "./pk-d-set.model";

export class PkDSetResponse extends GlobalResponseObject {
    data: PkDSetModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PkDSetModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}