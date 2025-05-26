import { GlobalResponseObject } from "../../../common";
import { PoOrderSubLineModel } from "./po-order-subline model";

export class PoSubLineResponse extends GlobalResponseObject {
    data ?: PoOrderSubLineModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoOrderSubLineModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}