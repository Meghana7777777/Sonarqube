import { GlobalResponseObject } from "../../../common";
import { BinDetailsModel } from "./bin-details.model";

export class BinDetailsResponse extends GlobalResponseObject{
    data?:BinDetailsModel[];
    
    constructor(status: boolean, errorCode: number, internalMessage: string, data: BinDetailsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}