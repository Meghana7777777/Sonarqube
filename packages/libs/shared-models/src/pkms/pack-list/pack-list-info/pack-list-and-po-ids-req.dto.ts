import { CommonRequestAttrs } from "../../../common";
import { PackActivityStatusEnum, PackFabricInspectionRequestCategoryEnum } from "../..";

export class PackListAndPoIdsReqDto extends CommonRequestAttrs {
    poId: number;
    packListId: number;
    insActivityStatus: PackActivityStatusEnum;
    inspectionType: PackFabricInspectionRequestCategoryEnum
    constructor(username: string, unitCode: string, companyCode: string, userId: number, poId: number,
        packListId: number, insActivityStatus: PackActivityStatusEnum, inspectionType: PackFabricInspectionRequestCategoryEnum) {
        super(username, unitCode, companyCode, userId)
        this.poId = poId;
        this.packListId = packListId;
        this.insActivityStatus = insActivityStatus;
        this.inspectionType = inspectionType;
    }
}