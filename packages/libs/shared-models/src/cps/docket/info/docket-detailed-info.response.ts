import { GlobalResponseObject } from "../../../common";
import { DocketDetailedInfoModel } from "./docket-detailed-info.model";

export class DocketDetailedInfoResponse extends GlobalResponseObject {
    data ?: DocketDetailedInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocketDetailedInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}