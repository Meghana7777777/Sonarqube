import { CommonRequestAttrs } from "../../common";
import { InsFabricInspectionRequestCategoryEnum, ThreadTypeEnum, TrimTypeEnum, YarnTypeEnum } from "../enum";

export class InsRollBarcodeInspCategoryReq extends CommonRequestAttrs{
    barcode: string;
    inspectionCategory: InsFabricInspectionRequestCategoryEnum

    constructor(username: string, unitCode: string, companyCode: string, userId: number, barcode: string, inspectionCategory: InsFabricInspectionRequestCategoryEnum){
        super(username,unitCode,companyCode,userId);
        this.barcode = barcode;
        this.inspectionCategory = inspectionCategory;
    }
}   

export class InsConeBarcodeInspCategoryReq extends CommonRequestAttrs{
    barcode: string;
    inspectionCategory: YarnTypeEnum

    constructor(username: string, unitCode: string, companyCode: string, userId: number, barcode: string, inspectionCategory: YarnTypeEnum){
        super(username,unitCode,companyCode,userId);
        this.barcode = barcode;
        this.inspectionCategory = inspectionCategory;
    }
}  


export class InsSpoolBarcodeInspCategoryReq extends CommonRequestAttrs{
    barcode: string;
    inspectionCategory: ThreadTypeEnum

    constructor(username: string, unitCode: string, companyCode: string, userId: number, barcode: string, inspectionCategory: ThreadTypeEnum){
        super(username,unitCode,companyCode,userId);
        this.barcode = barcode;
        this.inspectionCategory = inspectionCategory;
    }
} 

export class InsBoxBarcodeInspCategoryReq extends CommonRequestAttrs{
    barcode: string;
    inspectionCategory: TrimTypeEnum

    constructor(username: string, unitCode: string, companyCode: string, userId: number, barcode: string, inspectionCategory: TrimTypeEnum){
        super(username,unitCode,companyCode,userId);
        this.barcode = barcode;
        this.inspectionCategory = inspectionCategory;
    }
} 