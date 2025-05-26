import { PlannedDocketGroupModel } from "./planned-docket-group.model";

export class CutTableDocketsModel {
    tableId: string;
    tableDesc: string;
    tableName: string;
    docketsInfo: PlannedDocketGroupModel[];
    constructor(
        tableId: string,
        tableDesc: string,
        tableName: string,
        docketsInfo: PlannedDocketGroupModel[]
    ) {
        this.tableId = tableId;
        this.tableDesc = tableDesc;
        this.tableName = tableName;
        this.docketsInfo = docketsInfo;
    }
}