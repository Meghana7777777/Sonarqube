import { CommonRequestAttrs } from "../../../common";
import { GrnStatusEnum, PackListLoadingStatus } from "../../enum";


export class GrnUnLoadingModel extends CommonRequestAttrs {
    id: number;
    phId: number;
    originalUnloadingStartTime: Date;
    originalUnloadingCompletedTime: Date;
    lastUnloadStartTime: Date;
    lastUnloadEndTime: Date;
    unloadingPauseTime: Date;
    totalUnloadingSpentSeconds: number; // Gives always latest 
    vehicleNumber: string;
    driverName: string;
    securityPerson: string;
    vehicleContact: string;
    inAt: Date;
    outAt: Date;
    status: PackListLoadingStatus;
    grnStatus: GrnStatusEnum;
    versionFlag: number;
    packListStatus: PackListLoadingStatus;
    grnId: number;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, phId: number, unloadingStartTime: Date, unloadingCompletedTime: Date, vehicleNumber: string, driverName: string, securityPerson: string, vehicleContact: string, inAt: Date, outAt: Date, unloadingPauseTime: Date, totalUnloadingSpentSeconds: number, status: PackListLoadingStatus, grnStatus: GrnStatusEnum, versionFlag: number, lastUnloadStartTime: Date, lastUnloadEndTime: Date,packListStatus: PackListLoadingStatus,grnId: number) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.phId = phId;
        this.originalUnloadingStartTime = unloadingStartTime;
        this.originalUnloadingCompletedTime = unloadingCompletedTime;
        this.vehicleNumber = vehicleNumber;
        this.driverName = driverName;
        this.securityPerson = securityPerson;
        this.vehicleContact = vehicleContact;
        this.inAt = inAt;
        this.outAt = outAt;
        this.unloadingPauseTime = unloadingPauseTime;
        this.totalUnloadingSpentSeconds = totalUnloadingSpentSeconds;
        this.status = status;
        this.grnStatus = grnStatus;
        this.versionFlag = versionFlag;
        this.lastUnloadStartTime = lastUnloadStartTime;
        this.lastUnloadEndTime = lastUnloadEndTime;
        this.packListStatus = packListStatus;
        this.grnId = grnId;
    }
}
