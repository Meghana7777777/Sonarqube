import { CommonRequestAttrs } from "../../common";
import { PKMSInspectionLevelEnum, PackFabricInspectionRequestCategoryEnum } from "../enum";
 
import { PKMSInspReqStatusModel } from "./pkms-insp-req-status.model";


export class PKMSInspectionCreateRequest extends CommonRequestAttrs {
    packListId: number;
    batchNo: string;
    inspectionLevel: PKMSInspectionLevelEnum; // the ref type
    refNumber: string// the ref value . i.e either a batch number/ LOT number 
    rollIds: number[]; // the PK of the roll ids 
    requestCategory: PackFabricInspectionRequestCategoryEnum;
    sla: number; // always in minutes;
    preInspectionDetails: PKMSInspReqStatusModel[];
    lotQty: number;
    batchQty: number;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, packListId: number, batchNo: string, inspectionLevel: PKMSInspectionLevelEnum, refNumber: string, rollIds: number[], requestCategory: PackFabricInspectionRequestCategoryEnum, sla: number, preInspectionDetails: PKMSInspReqStatusModel[],lotQty: number,batchQty: number) {
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
