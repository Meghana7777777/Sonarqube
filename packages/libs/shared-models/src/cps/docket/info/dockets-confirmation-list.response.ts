import { GlobalResponseObject } from "../../../common";
import { DocketsConfirmationListModel } from "./dockets-confirmation-list.model";

export class DocketsConfirmationListResponse extends GlobalResponseObject {
    data ?: DocketsConfirmationListModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocketsConfirmationListModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}