import { GlobalResponseObject } from "../../../common";
import { PoEmbHeaderModel } from "./po-emb-header.model";

export class PoEmbHeaderResponse extends GlobalResponseObject {
    data ?: PoEmbHeaderModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoEmbHeaderModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}