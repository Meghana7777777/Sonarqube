import { GlobalResponseObject } from "../../common";
import { CheckinAndOuts } from "./vehicle-info-of-packing-list";

export class VehicleInfoResponse extends GlobalResponseObject{
    data?:CheckinAndOuts[];
    constructor(
        status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: CheckinAndOuts[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}