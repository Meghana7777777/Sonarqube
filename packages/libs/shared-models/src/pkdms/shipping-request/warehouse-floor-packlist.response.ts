import { GlobalResponseObject } from "../../common";
import { WarehouseGroup } from "./fg-warehouse-form-model";

export class WhFloorPackListResp extends GlobalResponseObject {
    data : WarehouseGroup[];

    constructor( status : boolean , errorCode : number, internalMessage : string , data : WarehouseGroup[]) {
        super(status,errorCode,internalMessage);
        this.data = data;
    }

}