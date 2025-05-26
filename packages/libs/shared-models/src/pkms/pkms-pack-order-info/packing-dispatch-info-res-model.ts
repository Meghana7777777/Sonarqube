import { GlobalResponseObject } from "../../common";
import { PKMSPackingDispatchPackListInfoModel } from "../pkms-pack-list-order-info";

export class PKMSPackDispatchInfoResponse extends GlobalResponseObject {
    data: PKMSPackingDispatchPackListInfoModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PKMSPackingDispatchPackListInfoModel[]) {
        super(status, errorCode, internalMessage,);
        this.data = data
    }
}
