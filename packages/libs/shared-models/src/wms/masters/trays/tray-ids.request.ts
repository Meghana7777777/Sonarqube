import { CommonRequestAttrs } from "../../../common";


export class TrayIdsRequest extends CommonRequestAttrs {
    ids: number[];
    iNeedTrolleyInfo: boolean;
    iNeedRollIdsInTray: boolean;
    dontThrowExceptoin: boolean; // A helper variable that actually stop throwing exception when passed in necessary time

    constructor(username: string, unitCode: string, companyCode: string, userId: number,ids: number[], dontThrowExceptoin: boolean, iNeedTrolleyInfo: boolean, iNeedRollIdsInTray: boolean){
 
        super(username,unitCode,companyCode,userId);
        this.ids = ids;
        this.iNeedTrolleyInfo = iNeedTrolleyInfo;
        this.iNeedRollIdsInTray = iNeedRollIdsInTray;
        this.dontThrowExceptoin = dontThrowExceptoin;
        
    }
}

// {
//     "ids": [2],
//     "overrideCapacity": false,
//     "companyCode": "5000",
//     "unitCode": "B3",
//     "username": "rajesh",
//     "userId": 0,
//     "dontThrowExceptoin": true,
//     "iNeedTrolleyInfo": true,
//     "iNeedRollIdsInTray": true
// }