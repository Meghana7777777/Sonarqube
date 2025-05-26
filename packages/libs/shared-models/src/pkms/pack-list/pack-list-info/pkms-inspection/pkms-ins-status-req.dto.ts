import { CommonRequestAttrs } from "packages/libs/shared-models/src/common";
import { InsStatusEnum } from "../../../inspection-preference";
import { PackFabricInspectionRequestCategoryEnum } from "../../../enum";

export class PKMSInsStatusReqDto extends CommonRequestAttrs {
    packListIds: number[];
    cartonIds: number[];
    insPreferenceType: PackFabricInspectionRequestCategoryEnum;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        packListIds: number[],
        cartonIds: number[],
        insPreferenceType: PackFabricInspectionRequestCategoryEnum,
    ) {
        super(username, unitCode, companyCode, userId);
        this.packListIds = packListIds;
        this.cartonIds = cartonIds;
        this.insPreferenceType = insPreferenceType;
    }

}