import { GlobalResponseObject } from "../../../common";
import { BinModel } from "./rack-and-bin.model";

export class RackAndBinResponse extends GlobalResponseObject{
    data : BinModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: BinModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   