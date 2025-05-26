import { GlobalResponseObject } from "../../common";
import { MeasuredWidthModel } from "./measured-width-model";

export class MeasuredWidthResponse extends GlobalResponseObject{
    data : MeasuredWidthModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: MeasuredWidthModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}