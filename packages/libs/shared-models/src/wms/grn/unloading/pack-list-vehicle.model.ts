import { CommonRequestAttrs } from "../../../common";

export class PackListVehicleIdModel extends CommonRequestAttrs {
    phVehicleId: number;
    phId: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, phVehicleId: number,phId: number) {
        super(username, unitCode, companyCode, userId)
        this.phVehicleId = phVehicleId;
        this.phId = phId;
    }
}