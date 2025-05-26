import { GlobalResponseObject } from "../../../common";



export class FgRackOccupiedRes extends GlobalResponseObject {
    data?: FgRackOccupiedResModel[];
    constructor(status: boolean,errorCode: number,internalMessage: string, data?: FgRackOccupiedResModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class FgRackOccupiedResModel{
    level: number;
    column: number;
    levelStatus: string;
    mappedColumns: number[];
    constructor(level: number, column: number, levelStatus: string, mappedColumns: number[]){
        this.level=level;
        this.column=column;
        this.levelStatus=levelStatus;
        this.mappedColumns=mappedColumns;
    } 
}