import { CommonRequestAttrs } from "../../common";

export class PKMS_C_ReadyToPackFgsRequest extends CommonRequestAttrs{
    tranId: number;
    fgs: number[];
    pslId: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, tranId: number, fgs: number[], pslId: number) {
        super(username, unitCode, companyCode, userId);
        this.tranId = tranId;
        this.fgs = fgs;
        this.pslId = pslId;
    }
}
