import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { DocketQuantityInformation, DocketsCardDetailsListModel } from "../docket-card-details-list.model";


export class DocketsCardDetailsResponse extends GlobalResponseObject {
    data ?: DocketsCardDetailsListModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocketsCardDetailsListModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class DocketHeaderResponse extends GlobalResponseObject {
    data ?: DocketQuantityInformation;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocketQuantityInformation) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}