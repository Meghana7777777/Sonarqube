import { CommonRequestAttrs } from "../../../common";


export class TrayRollMappingRequest extends CommonRequestAttrs {
    trayId: number; // PK of the l_tray
    rollIds: number[]; // PK of the roll ph_item_lines
    overrideCapacity: boolean; // The boolean that overrides the capacity of the tray if exceeds

    constructor(username: string, unitCode: string, companyCode: string, userId: number, trayId: number, rollIds: number[], overrideCapacity: boolean) {
        super(username, unitCode, companyCode, userId);
        this.trayId = trayId;
        this.rollIds = rollIds;
        this.overrideCapacity = overrideCapacity;
    }
}


// {
//     "trayId": 2,
//     "rollIds": [13312],
//     "overrideCapacity": false,
//     "companyCode": "5000",
//     "unitCode": "B3",
//     "username": "rajesh",
//     "userId": 0
// }