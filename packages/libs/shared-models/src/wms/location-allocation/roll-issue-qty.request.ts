import { CommonRequestAttrs } from "../../common";

export class RollIssueQtyRequest extends CommonRequestAttrs {
    rollId: number;
    issuedQty: number;
    remarks: string;
    deAllocateFromPallet: boolean;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, rollId: number, issuedQty: number, remarks: string, deAllocateFromPallet: boolean) {
        super(username, unitCode, companyCode, userId)
        this.rollId = rollId;
        this.issuedQty = issuedQty;
        this.remarks = remarks;
        this.deAllocateFromPallet = deAllocateFromPallet;
    }
}
