import { CommonRequestAttrs } from "../../common";

export class LayingPauseRequest extends CommonRequestAttrs {
    layId: number; // the pk of the po_docket_lay
    reasonId: number; // the reason id of the masters 
    remarks: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        layId: number,
        reasonId: number, // the reason id of the masters 
        remarks: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.layId = layId;
        this.reasonId = reasonId;
        this.remarks = remarks
    }
}