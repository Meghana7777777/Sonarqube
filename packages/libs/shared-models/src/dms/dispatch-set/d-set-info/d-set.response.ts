import { GlobalResponseObject } from "@xpparel/shared-models";
import { DSetModel } from "./d-set.model";

export class DSetResponse extends GlobalResponseObject {
    data: DSetModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DSetModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}