import { GlobalResponseObject } from "../../../common";
import { CartonSpecModel } from "./carton-spec.model";

export class CartonSpecResponse extends GlobalResponseObject{
    data ?: CartonSpecModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: CartonSpecModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}