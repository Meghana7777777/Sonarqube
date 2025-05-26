import { GlobalResponseObject } from "../../common";
import { CutTableOpenCloseDocketsCountModel } from "./cut-table-open-closed-dockets.model";

export class CutTableOpenCloseDocketsCountResponse extends GlobalResponseObject {
    data: CutTableOpenCloseDocketsCountModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: CutTableOpenCloseDocketsCountModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}