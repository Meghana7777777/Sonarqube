import { CommonRequestAttrs } from "../../../common";

export class CutTableIdRequest extends CommonRequestAttrs {
    cutTableId: number; // PK of the cut-table entity

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        cutTableId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.cutTableId = cutTableId;
    }
}

