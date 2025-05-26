import { GlobalResponseObject } from "../../../common";
import { StyleModel } from "./style-model";

export class StyleResponse extends GlobalResponseObject {
    data?: StyleModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: StyleModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}