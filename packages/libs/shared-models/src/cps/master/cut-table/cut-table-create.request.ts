import { CommonRequestAttrs } from "../../../common";
import { CutTableModel } from "./cut-table.model";

export class CutTableCreateRequest extends CommonRequestAttrs {
    cutTables: CutTableModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        cutTables: CutTableModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.cutTables = cutTables;
    }
}

