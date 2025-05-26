import { GlobalResponseObject } from "../../../common";
import { DocketBasicInfoModel } from "./docket-basic-info.model";
import { DocketsConfirmationListModel } from "./dockets-confirmation-list.model";

export class DocketBasicInfoResponse extends GlobalResponseObject {
    data ?: DocketBasicInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocketBasicInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}