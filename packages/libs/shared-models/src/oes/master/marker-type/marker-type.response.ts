import { CommonRequestAttrs, GlobalResponseObject } from "../../../common";
import { MarkerTypeModel } from "./marker-type.model";

export class MarkerTypeResponse extends GlobalResponseObject {
    data: MarkerTypeModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MarkerTypeModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
    
}