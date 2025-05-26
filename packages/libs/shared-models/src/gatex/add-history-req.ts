import { CommonRequestAttrs } from "../common";
import { TruckStateEnum } from "./enum/vehicle-state-enum";

export class ADDHistoryReqModel extends CommonRequestAttrs {
    vehicleId: number;
    refId: string;
    status: TruckStateEnum;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, refId: string,vehicleId: number, status: TruckStateEnum) {
        super(username, unitCode, companyCode, userId)
        this.vehicleId = vehicleId;
        this.refId = refId;
        this.status = status;
    }
}