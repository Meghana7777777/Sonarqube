import { CommonRequestAttrs } from "../../../common";


export class TrayBarcodesRequest extends CommonRequestAttrs {
    barcodes: string[];
    iNeedTrolleyInfo: boolean;
    iNeedRollIdsInTray: boolean;
    dontThrowExceptoin: boolean; // A helper variable that actually stop throwing exception when passed in necessary time

    constructor(username: string, unitCode: string, companyCode: string, userId: number,barcodes: string[], dontThrowExceptoin: boolean, iNeedTrolleyInfo: boolean, iNeedRollIdsInTray: boolean){
 
        super(username,unitCode,companyCode,userId);
        this.barcodes = barcodes;
        this.iNeedTrolleyInfo = iNeedTrolleyInfo;
        this.iNeedRollIdsInTray = iNeedRollIdsInTray;
        this.dontThrowExceptoin = dontThrowExceptoin;
        
    }
}

// {
//     "barcodes": ["", ""],
//     "overrideCapacity": false,
//     "companyCode": "5000",
//     "unitCode": "B3",
//     "username": "rajesh",
//     "userId": 0,
//     "dontThrowExceptoin": true,
//     "iNeedTrolleyInfo": true,
//     "iNeedRollIdsInTray": true
// }