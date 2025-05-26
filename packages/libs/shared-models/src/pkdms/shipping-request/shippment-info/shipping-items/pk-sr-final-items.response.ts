import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { PkSrFinalItemsModel } from "./pk-sr-final-items.model";


export class PkSrFinalItemsResponse extends GlobalResponseObject {
    data?: PkSrFinalItemsModel[];
    constructor(status : boolean , errorCode : number, internalMessage : string , data?: PkSrFinalItemsModel[]){
        super(status,errorCode,internalMessage);
        this.data = data
    }
}

