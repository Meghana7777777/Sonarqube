import { GlobalResponseObject } from "../../common";
import { DownTimeDetailsModel, SewingOrderModel } from "./sewing-order.model";


export class SewingOrderResponse extends GlobalResponseObject {
    data?: SewingOrderModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewingOrderModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class DownTimeDetailsResponse extends GlobalResponseObject {
    data?: DownTimeDetailsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DownTimeDetailsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}