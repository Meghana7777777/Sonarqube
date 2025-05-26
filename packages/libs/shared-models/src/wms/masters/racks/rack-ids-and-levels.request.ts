import { CommonRequestAttrs } from "../../../common";

export class RackIdsAndLevelsRequest extends CommonRequestAttrs {

    rackIds?: number[]; // The PK of the rack
    levels?: number[]; // The array of rack levels . usually integers from 1 to 5 or more 

    constructor(username: string, unitCode: string, companyCode: string, userId: number,rackIds: number[], levels: number[]){
        super(username,unitCode,companyCode,userId);
        this.rackIds = rackIds;
        this.levels = levels;
    } 
}


// {
//     "rackIds": [],
//     "levels": [],
//     "companyCode": "5000",
//     "unitCode": "B3"
// }