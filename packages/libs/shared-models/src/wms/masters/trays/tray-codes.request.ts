import { CommonRequestAttrs } from "../../../common";

export class TrayCodesRequest extends CommonRequestAttrs {
    traycodes: string[];
    iNeedTrolleyInfo: boolean;
    iNeedRollIdsInTray: boolean;
    dontThrowExceptoin: boolean; // A helper variable that actually stop throwing exception when passed in necessary time

    constructor(username: string, unitCode: string, companyCode: string, userId: number,traycodes: string[], dontThrowExceptoin: boolean, iNeedTrolleyInfo: boolean, iNeedRollIdsInTray: boolean){
 
        super(username,unitCode,companyCode,userId);
        this.traycodes = traycodes;
        this.iNeedTrolleyInfo = iNeedTrolleyInfo;
        this.iNeedRollIdsInTray = iNeedRollIdsInTray;
        this.dontThrowExceptoin = dontThrowExceptoin;
        
    }
}