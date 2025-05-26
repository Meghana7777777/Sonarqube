import { CommonRequestAttrs } from "../../../common";

export class VehiclesRequestModel extends CommonRequestAttrs {
    vehicleNumber: string;
    inAt: string;
    outAt: string;
    unloadingCompletedAt: string;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, vehicleNumber: string,
        inAt: string,
        outAt: string,
        unloadingCompletedAt: string) {
        super(username, unitCode, companyCode, userId);
        this.vehicleNumber = vehicleNumber;
        this.inAt = inAt;
        this.outAt = outAt;
        this.unloadingCompletedAt = unloadingCompletedAt;
    }
}