import { GlobalResponseObject } from "../../../common";
import { DocketNumberModel } from "./docket-number.model";
import { DocketsConfirmationListModel } from "./dockets-confirmation-list.model";

export class DocketNumberResponse extends GlobalResponseObject {
    data ?: DocketNumberModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocketNumberModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}