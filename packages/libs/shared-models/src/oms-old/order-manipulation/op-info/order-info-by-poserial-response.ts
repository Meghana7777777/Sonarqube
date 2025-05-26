import { GlobalResponseObject } from "../../../common";
import { OrderInfoByPoSerailModel } from "./order-info-by-poserial.model";

export class OrderInfoByPoSerailResponse extends GlobalResponseObject {
    data?: OrderInfoByPoSerailModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: OrderInfoByPoSerailModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}