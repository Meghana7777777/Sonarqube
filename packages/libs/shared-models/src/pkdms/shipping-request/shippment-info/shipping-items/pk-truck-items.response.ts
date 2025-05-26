import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { PkTruckItemsModel } from "./pk-truck-items.model";

export class PkTruckItemsResponse extends GlobalResponseObject {
    data?: PkTruckItemsModel[];
    constructor(status : boolean , errorCode : number, internalMessage : string , data ?: PkTruckItemsModel[]){
        super(status, errorCode, internalMessage);
        this.data = data
    }
}