
export class PackTableModel {
    id: number; // not required durin create
    capacity: number;
    tableName: string;
    tableDesc: string;
    extRefCode: string;
    isActive:boolean

    // TODO
    constructor(id: number, capacity: number, tableName: string, tableDesc: string, extRefCode: string,
    isActive:boolean
    ) {
        this.id = id;
        this.tableName = tableName;
        this.tableDesc = tableDesc;
        this.capacity = capacity;
        this.extRefCode = extRefCode;
        this.isActive=isActive
    }
}

