import { GlobalResponseObject } from "../../../common";
import { RackAndBinModel } from "./rack-and-bin.model";

export class TotalRackResponse extends GlobalResponseObject{
    data : RackAndBinModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: RackAndBinModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   