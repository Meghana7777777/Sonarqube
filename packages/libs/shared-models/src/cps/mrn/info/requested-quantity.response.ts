import { GlobalResponseObject } from "../../../common";
import { MrnRequestInfoModel, RequestQuantityModel } from "./requesetd-quantity.model";

export class RequestQuantityResponse extends GlobalResponseObject {
    data : RequestQuantityModel

    constructor(status: boolean, errorCode: number, internalMessage: string, data: RequestQuantityModel) {
        super(status, errorCode, internalMessage);
        this.data = data;

    }

} 

export class MrnRequestResponseOfTheDay extends GlobalResponseObject {
    data : MrnRequestInfoModel
    constructor(status: boolean, errorCode: number, internalMessage: string, data: MrnRequestInfoModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}