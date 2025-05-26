import { GlobalResponseObject } from "../../../common";
import { PlCartonWeightModel } from "./pl-carton-weight.model";

export class PlCartonWeightResponse extends GlobalResponseObject {
    data ?: PlCartonWeightModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PlCartonWeightModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
