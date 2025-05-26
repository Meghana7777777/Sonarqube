
import { GlobalResponseObject } from "../../../common";
import { OnFloorRollsModel } from "./on-floor-rolls.model";

export class OnFloorRollsResponse extends GlobalResponseObject {
    data ?: OnFloorRollsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: OnFloorRollsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
