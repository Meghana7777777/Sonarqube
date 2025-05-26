import { CommonRequestAttrs } from "../../common";

export class InsBasicRollInfoRequest extends CommonRequestAttrs {
    rollIds: number[];
    iNeedRollActualInfoAlso: boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, rollIds: number[], iNeedRollActualInfoAlso: boolean) {
        super(username, unitCode, companyCode, userId);
        this.rollIds=rollIds;
        this.iNeedRollActualInfoAlso = iNeedRollActualInfoAlso;
    }
}