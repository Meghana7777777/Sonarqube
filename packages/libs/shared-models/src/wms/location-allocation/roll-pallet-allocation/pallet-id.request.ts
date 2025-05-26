import { CommonRequestAttrs } from "../../../common";

export class PalletIdRequest extends CommonRequestAttrs{
    palletId: number;
    palletCode: string;
    iNeedRollActualInfoAlso?: boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,palletId: number,palletCode: string, iNeedRollActualInfoAlso?: boolean) {
        super(username, unitCode, companyCode, userId);
        this.palletId = palletId;
        this.palletCode = palletCode;
        this.iNeedRollActualInfoAlso = iNeedRollActualInfoAlso;
    }
}   