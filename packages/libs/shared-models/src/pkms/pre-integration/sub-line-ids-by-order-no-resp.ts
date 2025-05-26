import { GlobalResponseObject } from "../../common";
import { PackSubLineIdsByOrderNoModel } from "./sub-line-ids-by-order-no-model";


export class PackSubLineIdsByOrderNoResponse extends GlobalResponseObject {
    data: PackSubLineIdsByOrderNoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PackSubLineIdsByOrderNoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}