import { GlobalResponseObject } from "../../common";
import { OpVersionAbstractModel } from "./op-version-abstract.model";

export class OpVersionAbstractResponse extends GlobalResponseObject {
    data?: OpVersionAbstractModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: OpVersionAbstractModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}