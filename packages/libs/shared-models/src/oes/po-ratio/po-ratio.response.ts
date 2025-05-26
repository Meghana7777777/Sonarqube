import { GlobalResponseObject } from "../../common";
import { PoRatioModel } from "./po-ratio.model";


export class PoRatioResponse extends GlobalResponseObject {
    data ?: PoRatioModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoRatioModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}