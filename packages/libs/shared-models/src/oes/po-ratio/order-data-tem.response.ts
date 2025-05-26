
import { OrderItemDetailsModel } from "@xpparel/shared-models";
import { GlobalResponseObject } from "packages/libs/shared-models/src/common";

export class OrderDataItemDetailsResponse extends GlobalResponseObject {
    data ?: OrderItemDetailsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: OrderItemDetailsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}