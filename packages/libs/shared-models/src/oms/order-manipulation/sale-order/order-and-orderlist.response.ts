import { GlobalResponseObject } from "../../../common";
import { OrderAndOrderListModel } from "./order-and-orderlist.model";

export class OrderAndOrderListResponse extends GlobalResponseObject {
    data?: OrderAndOrderListModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: OrderAndOrderListModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}