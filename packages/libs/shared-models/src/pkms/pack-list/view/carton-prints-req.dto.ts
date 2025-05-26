import { CommonIdReqModal, CommonRequestAttrs } from "../../../common";

export class CartonPrintReqDto extends CommonRequestAttrs {
    poId: number;
    packListId: number;
    packJobId: number;
    cartonIds?:string[];
    constructor(
        poId: number,
        packListId: number,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        packJobId?: number,
        cartonIds?:string[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.poId = poId;
        this.packListId = packListId;
        this.packJobId = packJobId;
        this.cartonIds=cartonIds;
    }
}