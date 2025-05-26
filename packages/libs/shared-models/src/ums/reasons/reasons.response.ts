
import { GlobalResponseObject } from "../../common";
import { ReasonModel } from "./reasons.model";

export class ReasonResponse extends GlobalResponseObject {
    data: ReasonModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ReasonModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}