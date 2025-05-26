import { CommonRequestAttrs } from "../common";
import { LocationFromTypeEnum } from "./enum/vehicle-inr-enum";

export class GetVehicleNAInrReqModal extends CommonRequestAttrs {
    fromType: LocationFromTypeEnum;
    constructor(fromType: LocationFromTypeEnum, username: string, unitCode: string, companyCode: string, userId: number) {
        super(username, unitCode, companyCode, userId)
        this.fromType = fromType;
    }
}