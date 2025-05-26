import { GlobalResponseObject } from "../common";
import { MoLines } from "./list-of-solines";



export class MoListResponseData extends GlobalResponseObject {
    data?: MoLines;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MoLines) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}