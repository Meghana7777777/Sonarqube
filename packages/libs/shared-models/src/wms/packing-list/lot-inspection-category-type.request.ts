import { InsFabricInspectionRequestCategoryEnum } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../common";

export class LotNumberInspectionCategoryRequest extends CommonRequestAttrs{
    lotNumber: string;
    inspectionType: InsFabricInspectionRequestCategoryEnum;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        lotNumber: string,
        inspectionType: InsFabricInspectionRequestCategoryEnum,
    ) {
        super(username, unitCode, companyCode, userId)
        this.lotNumber = lotNumber;
        this.inspectionType = inspectionType;
    }
}