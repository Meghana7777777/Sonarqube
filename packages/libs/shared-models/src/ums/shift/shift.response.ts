import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { ShiftModel } from "./shift.model";

export class ShiftResponse extends GlobalResponseObject {
    data ?: ShiftModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ShiftModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
    
}