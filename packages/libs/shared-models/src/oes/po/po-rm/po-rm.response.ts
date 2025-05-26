
import { GlobalResponseObject } from "../../../common";
import { PoRmModel } from "./po-rm.model";

export class PoRmResponse extends GlobalResponseObject {
    data ?: PoRmModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoRmModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}