import { CommonRequestAttrs } from "../../../common";


export class TrolleyBinMappingRequest extends CommonRequestAttrs {
    binId: number; // PK of the l_bin. Only LEVEL 1 bins are accepted
    trolleyId: number; // PK of the trolley l_trolley
    overrideCapacity: boolean; // The boolean that overrides the capacity of the bin if exceeds

    constructor(username: string, unitCode: string, companyCode: string, userId: number, binId: number, trolleyId: number, overrideCapacity: boolean) {
        super(username, unitCode, companyCode, userId)
        this.binId = binId;
        this.trolleyId = trolleyId;
        this.overrideCapacity = overrideCapacity;
    }
}


// {
//     "binId": 1,
//     "trolleyId": 1,
//     "overrideCapacity": false,
//     "companyCode": "5000",
//     "unitCode": "B3",
//     "username": "rajesh",
//     "userId": 0
// }

