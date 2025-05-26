import { GlobalResponseObject } from "../common";
import { SewingCreationOptionsModel } from "./sewing-order-creation-model";


export class SewingCreationResponse extends GlobalResponseObject {
    data: SewingCreationOptionsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewingCreationOptionsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}