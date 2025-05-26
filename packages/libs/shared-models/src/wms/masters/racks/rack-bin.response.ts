import { GlobalResponseObject } from "../../../common";
import { BinModel } from "../../dashboard";


export class RackAndBInResponse extends GlobalResponseObject {
    data?: BinModel[];
    constructor(status: boolean,errorCode: number,internalMessage: string, data?: BinModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}