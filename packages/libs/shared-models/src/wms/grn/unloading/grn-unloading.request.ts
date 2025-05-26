import { CommonRequestAttrs } from "../../../common";
import { RollSelectionTypeEnum } from "../../enum";


export class GrnUnLoadingRequest extends CommonRequestAttrs {
    id: number; // ph_vehicle_id 
    phId: number;
    unloadingStartTime: Date;
    unloadingPauseTime: Date;
    unloadingSpentSecs: number; // WHEN USER PAUSED / COMPLETED THE UNLOADING NEED TO SEND THIS
    pauseReason: string; // ITS MANDATORY WHEN USER PAUSE THE UNLOADING
    remarks: string;
    unloadingCompletedTime: Date;
    versionFlag: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, phId: number, unloadingStartTime: Date, unloadingCompletedTime: Date, unloadingPauseTime: Date, unloadingSpentSecs: number, pauseReason: string, remarks: string, versionFlag: number) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.phId = phId;
        this.unloadingStartTime = unloadingStartTime;
        this.unloadingCompletedTime = unloadingCompletedTime;
        this.unloadingPauseTime = unloadingPauseTime;
        this.unloadingSpentSecs = unloadingSpentSecs;
        this.pauseReason = pauseReason;
        this.remarks = remarks;
        this.versionFlag = versionFlag;
    }
}
