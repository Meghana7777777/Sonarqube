import { CommonRequestAttrs } from "../../common";

export class QualityCheckListChangeRequest extends CommonRequestAttrs {
    id?: number;
    qualityTypeId: string;
    parameter: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id: number,
        qualityTypeId: string,
        parameter: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.qualityTypeId = qualityTypeId;
        this.parameter = parameter;
    }
}