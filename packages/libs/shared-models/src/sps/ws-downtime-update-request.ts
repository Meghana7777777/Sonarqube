import { CommonRequestAttrs } from "../common";

export class DowntimeUpdateRequest extends CommonRequestAttrs{
    id:number;
    endTime:string;
    description?:string;


    constructor(
        username:string,
        unitCode:string,
        companyCode:string,
        userId:number,
        id:number,
        endTime:string,
        description?:string
    ){
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.endTime = endTime;
        this.description = description;
    }
}