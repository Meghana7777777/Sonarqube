import { CommonRequestAttrs, RollLocationEnum } from "../../../common";

export class RollLocationRequest extends CommonRequestAttrs {
    location: RollLocationEnum[];
    iNeedUtilizationHistory: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        location: RollLocationEnum[],
        iNeedUtilizationHistory: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.location = location;
        this.iNeedUtilizationHistory = iNeedUtilizationHistory;
    }
}
