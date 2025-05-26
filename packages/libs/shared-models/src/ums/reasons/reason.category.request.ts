import { CommonRequestAttrs } from "../../common";
import { ReasonCategoryEnum } from "../enum";

export class ReasonCategoryRequest extends CommonRequestAttrs {
    reasonCategory: ReasonCategoryEnum;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        reasonCategory: ReasonCategoryEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.reasonCategory = reasonCategory;
    }
}