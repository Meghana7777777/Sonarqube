import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum, OpFormEnum } from "../../oms";

export class OperationCategoryFormRequest extends CommonRequestAttrs {
    opCategory?: ProcessTypeEnum;
    opForm: OpFormEnum;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        opForm: OpFormEnum,
        opCategory?: ProcessTypeEnum,

    ) {
        super(username, unitCode, companyCode, userId);
        this.opCategory = opCategory;
        this.opForm = opForm;
    }
}