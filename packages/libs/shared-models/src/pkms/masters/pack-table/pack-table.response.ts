
import { GlobalResponseObject } from "../../../common";
import { PackTableModel } from "./pack-table.model";

export class PackTableResponse extends GlobalResponseObject {
    data?: PackTableModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: PackTableModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}