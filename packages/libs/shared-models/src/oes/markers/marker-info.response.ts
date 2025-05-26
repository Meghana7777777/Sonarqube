import { GlobalResponseObject } from "../../common";
import { MarkerInfoModel } from "./marker-info.model";

export class MarkerInfoResponse extends GlobalResponseObject  {
    data ?: MarkerInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MarkerInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}