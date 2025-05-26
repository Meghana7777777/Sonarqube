import { TrimTypeEnum, YarnTypeEnum } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../common";
import { InsFabricInspectionRequestCategoryEnum } from "../enum";

export class InsLotNumberInspectionCategoryRequest extends CommonRequestAttrs{
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


export class YarnInsLotNumberInspectionCategoryRequest extends CommonRequestAttrs{
    lotNumber: string;
    inspectionType: YarnTypeEnum;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        lotNumber: string,
        inspectionType: YarnTypeEnum,
    ) {
        super(username, unitCode, companyCode, userId)
        this.lotNumber = lotNumber;
        this.inspectionType = inspectionType;
    }
} 


export class ThreadInsLotNumberInspectionCategoryRequest extends CommonRequestAttrs{
    lotNumber: string;
    inspectionType: YarnTypeEnum;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        lotNumber: string,
        inspectionType: YarnTypeEnum,
    ) {
        super(username, unitCode, companyCode, userId)
        this.lotNumber = lotNumber;
        this.inspectionType = inspectionType;
    }
} 


export class TrimInsLotNumberInspectionCategoryRequest extends CommonRequestAttrs{
    lotNumber: string;
    inspectionType: TrimTypeEnum;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        lotNumber: string,
        inspectionType: TrimTypeEnum,
    ) {
        super(username, unitCode, companyCode, userId)
        this.lotNumber = lotNumber;
        this.inspectionType = inspectionType;
    }
} 