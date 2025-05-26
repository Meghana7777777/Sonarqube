
import { GlobalResponseObject } from "../../../common";
import { MoListModel } from "./manf-order-list.model";


export class MoListResponse extends GlobalResponseObject {
    data?: MoListModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MoListModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}