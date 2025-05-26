import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { DocketBasicInfoModel } from "../docket-basic-info.model";
import { DocketGroupBasicInfoModel } from "./docket-group-basic-info.model";
import { DocketGroupDetailedInfoModel } from "./docket-group-detailed-info.model";

export class DocketGroupDetailedInfoResponse extends GlobalResponseObject {
    data ?: DocketGroupDetailedInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocketGroupDetailedInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}