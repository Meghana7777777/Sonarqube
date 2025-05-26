import { CommonRequestAttrs, RollLocationEnum } from "../../../common";
import { LockedFabMaterialModel } from "./locked-fab-material.model";

export class OnFloorRollIdsRequest extends CommonRequestAttrs {
    onFloorRollIds: number[];
    status: RollLocationEnum;
    reason: number;
    remarks: string;
    // onFloorRolls: LockedFabMaterialModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        onFloorRollIds: number[],
        status: RollLocationEnum,
        reason: number,
        remarks: string,
        onFloorRolls: LockedFabMaterialModel[],
    ) {
        super(username, unitCode, companyCode, userId);
        this.onFloorRollIds = onFloorRollIds;
        this.status = status;
        this.reason = reason;
        this.remarks = remarks;
        // this.onFloorRolls = onFloorRolls;
    }
}
