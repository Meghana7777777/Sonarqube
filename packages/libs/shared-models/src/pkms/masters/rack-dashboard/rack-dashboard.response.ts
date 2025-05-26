
import { GlobalResponseObject } from "../../../common";
import { FgRacksAndLocationModel } from "./rack-and-location.model";


export class FgTotalRackRes extends GlobalResponseObject{
    data : FgRacksAndLocationModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: FgRacksAndLocationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   