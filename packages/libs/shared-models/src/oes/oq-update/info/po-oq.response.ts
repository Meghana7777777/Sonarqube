import { GlobalResponseObject } from "../../../common";
import { PoOqUpdateModel } from "./po-oq-upate.model";

export class PoOqResponse extends GlobalResponseObject {
    data ?: PoOqUpdateModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoOqUpdateModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}