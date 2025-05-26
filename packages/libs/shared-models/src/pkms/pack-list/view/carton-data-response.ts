

import { GlobalResponseObject } from "../../../common";
import { CartonDataForEachPl, CartonDataModel } from "./carton-data-model";

export class CartonDataResponse extends GlobalResponseObject {
    data: CartonDataForEachPl[]
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string, data: CartonDataForEachPl[]
    ) {
        super(status, errorCode, internalMessage)
        this.data = data
    }
}