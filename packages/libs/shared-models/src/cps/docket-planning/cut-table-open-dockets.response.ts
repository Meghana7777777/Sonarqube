import { GlobalResponseObject } from "../../common";
import { CutTableDocketsModel } from "./cut-table-dockets.model";

export class CutTableOpenDocketsResponse extends GlobalResponseObject {
    data: CutTableDocketsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: CutTableDocketsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}