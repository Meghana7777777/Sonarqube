import { CommonRequestAttrs } from "../../common";

export class PackJobPlanningRequest extends CommonRequestAttrs{
    workStationsId:number 
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        workStationsId:number
    ){
        super(username, unitCode, companyCode, userId);
        this.workStationsId = workStationsId;
    }

}