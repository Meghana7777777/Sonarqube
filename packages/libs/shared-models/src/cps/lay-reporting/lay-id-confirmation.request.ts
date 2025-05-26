import { CommonRequestAttrs } from "../../common";

export class LayIdConfirmationRequest extends CommonRequestAttrs {
    layId: number; // the pk of the po_docket_lay
    storageLocation: string;
    layInspector: string;
    reason: string;
    remarks: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        layId: number,
        storageLocation: string,
        layInspector: string,
        reason: string,
        remarks: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.layId = layId;
        this.storageLocation = storageLocation;
        this.layInspector = layInspector;
        this.reason = reason;
        this.remarks = remarks;
    }
}