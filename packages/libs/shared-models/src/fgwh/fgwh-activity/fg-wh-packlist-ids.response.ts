import { GlobalResponseObject } from "../../common";
import { FgWhLinesResDto } from "./fg-wh-lines-res-dto";
import { FgwhPackListIdsModel } from "./fg-wh-packlist-ids.model";

export class FgwhPackListIdsResponse extends GlobalResponseObject {
    data: FgwhPackListIdsModel;
    constructor(status: boolean, errorCode: number, internalMessage: string, data: FgwhPackListIdsModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}