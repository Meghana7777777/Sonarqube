import { CommonRequestAttrs } from "../../../common";
import { InsFabricInspectionRequestCategoryEnum, InsInspectionActivityStatusEnum, ThreadTypeEnum, TrimTypeEnum, YarnTypeEnum } from "../../enum";

export class InsInspectionTypeRequest extends CommonRequestAttrs {
    inspectionType: InsFabricInspectionRequestCategoryEnum;
    inspectionCurrentActivity: InsInspectionActivityStatusEnum;
    fromCount: number;
    recordsCount: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, inspectionType: InsFabricInspectionRequestCategoryEnum, inspectionCurrentActivity: InsInspectionActivityStatusEnum,fromCount: number, recordsCount: number){
        super(username,unitCode,companyCode,userId);
        this.inspectionType = inspectionType;
        this.inspectionCurrentActivity = inspectionCurrentActivity;
        this.fromCount = fromCount;
        this.recordsCount = recordsCount;
    }
} 







export class ThreadInspectionTypeRequest extends CommonRequestAttrs {
    inspectionType: ThreadTypeEnum;
    inspectionCurrentActivity: InsInspectionActivityStatusEnum;
    fromCount: number;
    recordsCount: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, inspectionType: ThreadTypeEnum, inspectionCurrentActivity: InsInspectionActivityStatusEnum, fromCount: number, recordsCount: number) {
        super(username, unitCode, companyCode, userId);
        this.inspectionType = inspectionType;
        this.inspectionCurrentActivity = inspectionCurrentActivity;
        this.fromCount = fromCount;
        this.recordsCount = recordsCount;
    }
} 



export class YarnInspectionTypeRequest extends CommonRequestAttrs {
    inspectionType: YarnTypeEnum;
    inspectionCurrentActivity: InsInspectionActivityStatusEnum;
    fromCount: number;
    recordsCount: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, inspectionType: YarnTypeEnum, inspectionCurrentActivity: InsInspectionActivityStatusEnum, fromCount: number, recordsCount: number) {
        super(username, unitCode, companyCode, userId);
        this.inspectionType = inspectionType;
        this.inspectionCurrentActivity = inspectionCurrentActivity;
        this.fromCount = fromCount;
        this.recordsCount = recordsCount;
    }
}


export class TrimInspectionTypeRequest extends CommonRequestAttrs {
    inspectionType: TrimTypeEnum;
    inspectionCurrentActivity: InsInspectionActivityStatusEnum;
    fromCount: number;
    recordsCount: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, inspectionType: TrimTypeEnum, inspectionCurrentActivity: InsInspectionActivityStatusEnum, fromCount: number, recordsCount: number) {
        super(username, unitCode, companyCode, userId);
        this.inspectionType = inspectionType;
        this.inspectionCurrentActivity = inspectionCurrentActivity;
        this.fromCount = fromCount;
        this.recordsCount = recordsCount;
    }
}
