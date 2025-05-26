import { CommonRequestAttrs, InsInspectionActivityStatusEnum, PackActivityStatusEnum, ThreadTypeEnum } from "../..";

export class InsThreadPackListAndPoIdsReqDto extends CommonRequestAttrs {
    poId: number;
    packListId: number;
    insActivityStatus: InsInspectionActivityStatusEnum;
    inspectionType: ThreadTypeEnum
    constructor(username: string, unitCode: string, companyCode: string, userId: number, poId: number,
        packListId: number, insActivityStatus: InsInspectionActivityStatusEnum, inspectionType: ThreadTypeEnum) {
        super(username, unitCode, companyCode, userId)
        this.poId = poId;
        this.packListId = packListId;
        this.insActivityStatus = insActivityStatus;
        this.inspectionType = inspectionType;
    }
}   