import { GlobalResponseObject } from "../../common";
import { ManufacturingOrderItemDataModel } from "./manf-order-item.model";

export class ManufacturingOrderItemDataResponse extends GlobalResponseObject{s
    data : ManufacturingOrderItemDataModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: ManufacturingOrderItemDataModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}