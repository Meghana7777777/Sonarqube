import { GlobalResponseObject,  } from "../../common";
import { GBLocationModel } from "./gb-location-model";

 export class GBLocationResponse extends GlobalResponseObject {
    data?: GBLocationModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: GBLocationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}