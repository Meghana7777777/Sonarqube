import { GlobalResponseObject } from "../../../common";
import { UnloadingVehicleDetailsModel } from "./vehicle-unloading-details";

export class GetUnloadingDataResp extends GlobalResponseObject{
    data : UnloadingVehicleDetailsModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: UnloadingVehicleDetailsModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   