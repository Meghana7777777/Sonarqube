import { GlobalResponseObject } from "../../common";
import { UnitsModel } from "./units-model";

export class UnitsResponse extends GlobalResponseObject {
    data?: UnitsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: UnitsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}