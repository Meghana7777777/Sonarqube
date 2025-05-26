import { GlobalResponseObject } from "../../../common";
import { FgWarehouseContainerCartonsModel } from "./warehouse-container-cartons.model";


export class FgWarehouseContainerCartonsResponse extends GlobalResponseObject {
    data?: FgWarehouseContainerCartonsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: FgWarehouseContainerCartonsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
