
import { GlobalResponseObject } from "../../../common";
import { SoListModel } from "./sale-order-list.model";


export class SoListResponse extends GlobalResponseObject {
    data?: SoListModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SoListModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}