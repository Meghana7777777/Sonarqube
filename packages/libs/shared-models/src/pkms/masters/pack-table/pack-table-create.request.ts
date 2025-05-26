import { CommonRequestAttrs } from "../../../common";
import { PackTableModel } from "./pack-table.model";

export class PackTableCreateRequest extends CommonRequestAttrs {
    cutTables: PackTableModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        cutTables: PackTableModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.cutTables = cutTables;
    }
}

