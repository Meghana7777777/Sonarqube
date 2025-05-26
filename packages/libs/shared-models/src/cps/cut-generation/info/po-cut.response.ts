
import { GlobalResponseObject } from "../../../common";
import { PoCutModel } from "./po-cut.model";


export class PoCutResponse extends GlobalResponseObject {
    data ?: PoCutModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoCutModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}