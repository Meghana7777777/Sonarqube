import { GlobalResponseObject } from "../../../common";
import { VehiclesRequestModel } from "./vehicle-request-model";


export class VehiclesResponse extends GlobalResponseObject {
    data?: VehiclesRequestModel;

    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: VehiclesRequestModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}