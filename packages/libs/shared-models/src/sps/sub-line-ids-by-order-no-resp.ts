import { GlobalResponseObject } from "../common";
import { SubLineIdsByOrderNoModel } from "./sub-line-ids-by-order-no-model";

export class SubLineIdsByOrderNoResponse extends GlobalResponseObject {
    data: SubLineIdsByOrderNoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SubLineIdsByOrderNoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}