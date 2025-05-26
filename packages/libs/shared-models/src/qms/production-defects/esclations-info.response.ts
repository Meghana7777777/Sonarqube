import { GlobalResponseObject } from "../../common";
import { EsclationsInfo } from "./esclations-info.model";

export class EsclationsInfoResponse extends GlobalResponseObject {
    data: EsclationsInfo[]


    constructor(status: boolean, errorCode: number, internalMessage: string, data: EsclationsInfo[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}