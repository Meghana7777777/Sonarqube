import { TrimTypeEnum, YarnTypeEnum } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../../common";
import { InsFabricInspectionRequestCategoryEnum, InsInspectionActivityStatusEnum, ThreadTypeEnum } from "../../enum";

export class InsInspectionRequestsFilterRequest extends CommonRequestAttrs {
    inspectionType: InsFabricInspectionRequestCategoryEnum;
    inspectionCurrentActivity: InsInspectionActivityStatusEnum;
    // fromCount: number;
    // recordsCount: number;
    itemCode:string;
    // po_number: string[]; 
    styleName:string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, inspectionType: InsFabricInspectionRequestCategoryEnum, inspectionCurrentActivity: InsInspectionActivityStatusEnum,itemCode:string,
        ){
        super(username,unitCode,companyCode,userId);
        this.inspectionType = inspectionType;
        this.inspectionCurrentActivity = inspectionCurrentActivity;
        // this.fromCount = fromCount;
        // this.recordsCount = recordsCount;
        this.itemCode=itemCode;
        // this.po_number=po_number;
        this.styleName=this.styleName;
    }
}




export class YarnInsInspectionRequestsFilterRequest extends CommonRequestAttrs {
    inspectionType: YarnTypeEnum;
    inspectionCurrentActivity: InsInspectionActivityStatusEnum;
    // fromCount: number;
    // recordsCount: number;
    itemCode:string;
    // po_number: string[]; 
    styleName:string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, inspectionType: YarnTypeEnum, inspectionCurrentActivity: InsInspectionActivityStatusEnum,itemCode:string,
        ){
        super(username,unitCode,companyCode,userId);
        this.inspectionType = inspectionType;
        this.inspectionCurrentActivity = inspectionCurrentActivity;
        // this.fromCount = fromCount;
        // this.recordsCount = recordsCount;
        this.itemCode=itemCode;
        // this.po_number=po_number;
        this.styleName=this.styleName;
    }
} 

export class TrimInsInspectionRequestsFilterRequest extends CommonRequestAttrs {
    inspectionType: TrimTypeEnum;
    inspectionCurrentActivity: InsInspectionActivityStatusEnum;
    // fromCount: number;
    // recordsCount: number;
    itemCode:string;
    // po_number: string[]; 
    styleName:string;
    
    constructor(username: string, unitCode: string, companyCode: string, userId: number, inspectionType: TrimTypeEnum, inspectionCurrentActivity: InsInspectionActivityStatusEnum,itemCode:string,
        ){
        super(username,unitCode,companyCode,userId);
        this.inspectionType = inspectionType;
        this.inspectionCurrentActivity = inspectionCurrentActivity;
        // this.fromCount = fromCount;
        // this.recordsCount = recordsCount;
        this.itemCode=itemCode;
        // this.po_number=po_number;
        this.styleName=this.styleName;
        
    }
} 

export class ThreadInsInspectionRequestsFilterRequest extends CommonRequestAttrs {
    inspectionType: ThreadTypeEnum;
    inspectionCurrentActivity: InsInspectionActivityStatusEnum;
    // fromCount: number;
    // recordsCount: number;
    itemCode:string;
    // po_number: string[]; 
    styleName:string;
    
    constructor(username: string, unitCode: string, companyCode: string, userId: number, inspectionType: ThreadTypeEnum, inspectionCurrentActivity: InsInspectionActivityStatusEnum,itemCode:string,
        ){
        super(username,unitCode,companyCode,userId);
        this.inspectionType = inspectionType;
        this.inspectionCurrentActivity = inspectionCurrentActivity;
        // this.fromCount = fromCount;
        // this.recordsCount = recordsCount;
        this.itemCode=itemCode;
        // this.po_number=po_number;
        this.styleName=this.styleName;
        
    }
}

