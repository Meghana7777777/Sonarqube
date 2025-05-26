import { GlobalResponseObject } from "../../common";
import { PKMSCartonInfoModel } from "./pkms-carton-info-res.dto";

export class PKMSCartonInfoResponse extends GlobalResponseObject {
    data: PKMSCartonInfoModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PKMSCartonInfoModel[]) {
        super(status,
            errorCode,
            internalMessage)
        this.data = data;
    }
}
