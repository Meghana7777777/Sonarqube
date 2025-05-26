import { GlobalResponseObject } from "../../common";
import { PKMSPackListInfoModel } from "./pkms-pack-list-info-res.dto";

export class PKMSPackListInfoResponse extends GlobalResponseObject {
    data: PKMSPackListInfoModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PKMSPackListInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data
    }
}