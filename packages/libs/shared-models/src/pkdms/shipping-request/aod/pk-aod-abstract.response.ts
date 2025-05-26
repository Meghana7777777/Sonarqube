import { GlobalResponseObject } from "@xpparel/shared-models";
import { PkAodAbstarctModel } from "./pk-aod-abstract.model";

export class PkAodAbstractResponse extends GlobalResponseObject {
    data: PkAodAbstarctModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PkAodAbstarctModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}