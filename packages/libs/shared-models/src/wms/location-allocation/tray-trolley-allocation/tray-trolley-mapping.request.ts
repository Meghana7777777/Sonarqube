import { CommonRequestAttrs } from "../../../common";


export class TrayTrolleyMappingRequest extends CommonRequestAttrs {
    trayIds: number[]; // PK of the l_tray
    trolleyId: number; // PK of the trolley l_trolley
    overrideCapacity: boolean; // The boolean that overrides the capacity of the trolly if exceeds

    constructor(username: string, unitCode: string, companyCode: string, userId: number, trayIds: number[], trolleyId: number, overrideCapacity: boolean) {
        super(username, unitCode, companyCode, userId)
        this.trayIds = trayIds;
        this.trolleyId = trolleyId;
        this.overrideCapacity = overrideCapacity;
    }
}

// {
//     "trayIds": [2],
//     "trolleyId": 1,
//     "overrideCapacity": false,
//     "companyCode": "5000",
//     "unitCode": "B3",
//     "username": "rajesh",
//     "userId": 0
// }