import { CommonRequestAttrs, InsInspectionActivityStatusEnum, PackActivityStatusEnum, PackFabricInspectionRequestCategoryEnum } from "../..";

export class InsPackListAndPoIdsReqDto extends CommonRequestAttrs {
    poId: number;
    packListId: number;
    insActivityStatus: InsInspectionActivityStatusEnum;
    inspectionType: PackFabricInspectionRequestCategoryEnum;
    fromCount: number;
    recordsCount: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, poId: number,
        packListId: number, insActivityStatus: InsInspectionActivityStatusEnum, inspectionType: PackFabricInspectionRequestCategoryEnum, fromCount: number,
        recordsCount: number) {
        super(username, unitCode, companyCode, userId)
        this.poId = poId;
        this.packListId = packListId;
        this.insActivityStatus = insActivityStatus;
        this.inspectionType = inspectionType;
        this.fromCount = fromCount;
        this.recordsCount = recordsCount;
    }
}   