import { GlobalResponseObject } from "../../../common";


export class RackOccupiedResponse extends GlobalResponseObject {
    data?: RackOccupiedResponseModel[];
    constructor(status: boolean,errorCode: number,internalMessage: string, data?: RackOccupiedResponseModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class RackOccupiedResponseModel {
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