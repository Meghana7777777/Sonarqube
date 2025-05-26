import { CommonRequestAttrs } from "../../../common";


export class PLAndPackJobBarCodeRequest extends CommonRequestAttrs {
    packListId: number;
    packJobId: number;

    constructor(
        packListId: number,
        packJobId: number,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number
    ) {
        super(username, unitCode, companyCode, userId)
        this.packListId = packListId;
        this.packJobId = packJobId;
    }
}