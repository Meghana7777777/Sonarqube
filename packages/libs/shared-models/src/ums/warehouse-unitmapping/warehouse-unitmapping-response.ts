import { WarehouseUnitmappingModel } from "@xpparel/shared-models";
import { GlobalResponseObject } from "../../common";

export class WarehouseUnitmappingResponse extends GlobalResponseObject {
    data?: WarehouseUnitmappingModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: WarehouseUnitmappingModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}