
import { GlobalResponseObject } from "../../../common";
import { WhMatReqLineItemStatusEnum } from "../../../wms";
import { OnFloorRollsModel } from "./on-floor-rolls.model";

export class RollAllocationStatusModel {
    rollId: number;
    rollBarcode: string;
    rollCurrentStatus: WhMatReqLineItemStatusEnum[];

    constructor(rollId: number, rollBarcode: string,  rollCurrentStatus: WhMatReqLineItemStatusEnum[]) {
        this.rollId = rollId;
        this.rollBarcode = rollBarcode;
        this.rollCurrentStatus = rollCurrentStatus;
    }
}
