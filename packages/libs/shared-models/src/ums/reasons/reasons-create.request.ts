import { CommonRequestAttrs } from "../../common";
import { ReasonModel } from "./reasons.model";

export class ReasonCreateRequest extends CommonRequestAttrs {
    reasons: ReasonModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        reasons: ReasonModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.reasons = reasons;
    }
}

