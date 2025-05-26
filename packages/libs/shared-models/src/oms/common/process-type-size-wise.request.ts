import { CommonRequestAttrs } from "../../common";

export class ProcessTypeSizeWiseRequest extends CommonRequestAttrs {
    moPslId: number[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        moPslId: number[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.moPslId = moPslId;
    }
}