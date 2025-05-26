import { CommonRequestAttrs, RollLocationEnum, RollReceivingConfirmationStatusEnum } from "../../../common";
import { LockedFabMaterialModel } from "./locked-fab-material.model";

export class OnFloorConfirmedRollIdsRequest extends CommonRequestAttrs {
    onFloorRollIds: number[];
    confirmationStatus: RollReceivingConfirmationStatusEnum;
    remarks: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        onFloorRollIds: number[],
        confirmationStatus: RollReceivingConfirmationStatusEnum,
        remarks: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.onFloorRollIds = onFloorRollIds;
        this.confirmationStatus = confirmationStatus;
        this.remarks = remarks;
    }
}
