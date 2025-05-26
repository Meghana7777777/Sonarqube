
import { GlobalResponseObject } from "../../../common";
import { FgLocationModel } from "./rack-and-location.model";



export class FgRackAndLocationRes extends GlobalResponseObject{
    data : FgLocationModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: FgLocationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   