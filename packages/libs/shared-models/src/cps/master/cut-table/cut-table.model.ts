import { CommonRequestAttrs } from "../../../common";

export class CutTableModel  {
    id: number; // not required durin create
    capacity: number;
    tableName: string;
    tableDesc: string;
    extRefCode: string;

    // TODO
    constructor(id: number,capacity: number,tableName: string,tableDesc: string,extRefCode: string) {
        this.id=id;
        this.tableName=tableName;
        this.tableDesc=tableDesc;
        this.capacity=capacity;
        this.extRefCode=extRefCode;
    }
}

