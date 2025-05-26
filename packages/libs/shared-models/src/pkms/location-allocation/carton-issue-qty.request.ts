import { CommonRequestAttrs } from "../../common";

export class CartonIssueQtyRequest extends CommonRequestAttrs {
    cartonId: number;
    issuedQty: number;
    remarks: string;
    deAllocateFromContainer: boolean;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, cartonId: number, issuedQty: number, remarks: string, deAllocateFromContainer: boolean) {
        super(username, unitCode, companyCode, userId)
        this.cartonId = cartonId;
        this.issuedQty = issuedQty;
        this.remarks = remarks;
        this.deAllocateFromContainer = deAllocateFromContainer;
    }
}
