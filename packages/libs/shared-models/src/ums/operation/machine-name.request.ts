import { CommonRequestAttrs } from "../../common";

export class MachineNameRequest extends CommonRequestAttrs{
    machineName : string;
    constructor( 
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        machineName : string
    ){
        super(username, unitCode, companyCode, userId);
        this.machineName = machineName;
    }
}