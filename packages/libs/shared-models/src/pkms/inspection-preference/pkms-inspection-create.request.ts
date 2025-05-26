import { CommonRequestAttrs } from "../../common";
import { InsCartonSelectLevelEnum, PackFabricInspectionRequestCategoryEnum } from "../enum";


export class PackInspectionCreateRequest extends CommonRequestAttrs {
    poId: number;
    packListId: number;
    inspectionLevel: InsCartonSelectLevelEnum; // the ref type
    refNumber: string// the ref value . i.e either a pack List number/ pack job number 
    cartonBarCodes: string[]; // the PK of the carton ids 
    requestCategory: PackFabricInspectionRequestCategoryEnum;
    sla: number; // always in minutes;

    constructor(username: string, unitCode: string, companyCode: string, userId: number,poId:number, packListId: number,  inspectionLevel: InsCartonSelectLevelEnum, refNumber: string, cartonBarCodes: string[], requestCategory: PackFabricInspectionRequestCategoryEnum, sla: number) {
        super(username, unitCode, companyCode, userId);
        this.poId = poId;
        this.packListId = packListId;
        this.inspectionLevel = inspectionLevel;
        this.refNumber = refNumber;
        this.cartonBarCodes = cartonBarCodes;
        this.requestCategory = requestCategory;
        this.sla = sla;
    }
}
