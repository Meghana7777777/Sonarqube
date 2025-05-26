import { CommonRequestAttrs, RollLocationEnum, RollReceivingConfirmationStatusEnum } from "../../../common";
import { LockedFabMaterialModel } from "./locked-fab-material.model";

export class OnFloorConfirmedRollBarcodeRequest extends CommonRequestAttrs {
    rollBarcode: string;
    confirmationStatus: RollReceivingConfirmationStatusEnum;
    remarks: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        rollBarcode: string,
        confirmationStatus: RollReceivingConfirmationStatusEnum,
        remarks: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.rollBarcode = rollBarcode;
        this.confirmationStatus = confirmationStatus;
        this.remarks = remarks;
    }
}
