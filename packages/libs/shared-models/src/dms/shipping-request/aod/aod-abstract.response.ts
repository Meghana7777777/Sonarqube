import { GlobalResponseObject } from "@xpparel/shared-models";
import { AodAbstarctModel } from "./aod-abstract.model";

export class AodAbstractResponse extends GlobalResponseObject {
    data: AodAbstarctModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: AodAbstarctModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}