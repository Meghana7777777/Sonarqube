
import { GlobalResponseObject } from "../../../common";
import { OnFloorRollsModel } from "./on-floor-rolls.model";
import { RollAllocationStatusModel } from "./roll-allocation-status.model";

export class RollAllocationStatusResponse extends GlobalResponseObject {
    data ?: RollAllocationStatusModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: RollAllocationStatusModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
