import { GlobalResponseObject } from "../../common";
import { PKMSPackOrderInfoModel } from "./pkms-pack-order-info-res-dto";

export class PKMSPackOrderInfoResponse extends GlobalResponseObject {
    data: PKMSPackOrderInfoModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PKMSPackOrderInfoModel[]) {
        super(status, errorCode, internalMessage,);
        this.data = data
    }
}
