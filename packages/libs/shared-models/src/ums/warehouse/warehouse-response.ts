import { WarehouseModel } from "@xpparel/shared-models";
import { GlobalResponseObject } from "../../common";

export class WarehouseResponse extends GlobalResponseObject {
    data?: WarehouseModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: WarehouseModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}