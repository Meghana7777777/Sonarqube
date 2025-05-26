import { GlobalResponseObject } from "../../common";
import { CartonFillingModel } from "./carton-filing.model";



export class CartonFillingResponse extends GlobalResponseObject {
    data?: CartonFillingModel;
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: CartonFillingModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}