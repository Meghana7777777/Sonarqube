import { CommonRequestAttrs } from "../../common";
import {  InsInspectionLevelEnum, InsFabricInspectionRequestCategoryEnum } from "../enum";
import { InsInspReqStatusModel } from "./insp-req-status.model";


export class InsInspectionCreateRequest extends CommonRequestAttrs {
    packListId: number;
    batchNo: string;
    inspectionLevel: InsInspectionLevelEnum; // the ref type
    refNumber: string// the ref value . i.e either a batch number/ LOT number 
    rollIds: number[]; // the PK of the roll ids 
    requestCategory: InsFabricInspectionRequestCategoryEnum;
    sla: number; // always in minutes;
    preInspectionDetails: InsInspReqStatusModel[];
    lotQty: number;
    batchQty: number;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, packListId: number, batchNo: string, inspectionLevel: InsInspectionLevelEnum, refNumber: string, rollIds: number[], requestCategory: InsFabricInspectionRequestCategoryEnum, sla: number, preInspectionDetails: InsInspReqStatusModel[],lotQty: number,batchQty: number) {
        super(username, unitCode, companyCode, userId);
        this.packListId = packListId;
        this.batchNo = batchNo;
        this.inspectionLevel = inspectionLevel;
        this.refNumber = refNumber;
        this.rollIds = rollIds;
        this.requestCategory = requestCategory;
        this.sla = sla;
        this.preInspectionDetails = preInspectionDetails;
        this.lotQty = lotQty;
        this.batchQty = batchQty;
    }
}
