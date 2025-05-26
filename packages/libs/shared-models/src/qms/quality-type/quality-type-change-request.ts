import { CommonRequestAttrs } from "../../common";

export class QualityTypeChangeRequest extends CommonRequestAttrs {
    id?: number;
    qualityType: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id: number,
        qualityType: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.qualityType = qualityType;
    }
}