
import { GlobalResponseObject } from "../../../common";
import { CutTableModel } from "./cut-table.model";

export class CutTableResponse extends GlobalResponseObject {
    data: CutTableModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: CutTableModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}