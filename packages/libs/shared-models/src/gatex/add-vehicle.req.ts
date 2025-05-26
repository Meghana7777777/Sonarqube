import { CommonRequestAttrs } from "../common";
import { LocationFromTypeEnum } from "./enum";
import { VehicleModal } from "./vehicle-model";

export class ADDVehicleReqModal extends CommonRequestAttrs {
    refId: string;
    refNo: string;
    fromType: LocationFromTypeEnum;
    vehicleDetails: VehicleModal[]
    constructor(refId: string, refNo: string, fromType: LocationFromTypeEnum, vehicleDetails: VehicleModal[], username: string, unitCode: string, companyCode: string, userId: number) {
        super(username, unitCode, companyCode, userId)
        this.refId = refId;
        this.refNo = refNo;
        this.fromType = fromType;
        this.vehicleDetails = vehicleDetails
    }
}