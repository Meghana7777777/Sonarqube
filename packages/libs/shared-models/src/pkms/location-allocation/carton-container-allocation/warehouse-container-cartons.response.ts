import { CommonRequestAttrs, GlobalResponseObject } from "../../../common";
import { WarehouseContainerCartonsModel } from "./warehouse-container-cartons.model";

export class WarehouseContainerCartonsResponse extends GlobalResponseObject {
    data?: WarehouseContainerCartonsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: WarehouseContainerCartonsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
