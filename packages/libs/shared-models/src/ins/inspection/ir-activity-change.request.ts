import { CommonRequestAttrs } from "../../common";
import { InsInspectionActivityStatusEnum } from "../enum";


export class InsIrActivityChangeRequest extends CommonRequestAttrs {
    irId: number;
    insCurrentActivity: InsInspectionActivityStatusEnum;
    changeDateTime: string;
    remarks: string;

    constructor( username: string, unitCode: string, companyCode: string, userId: number, irId: number, changeDateTime: string, insCurrentActivity: InsInspectionActivityStatusEnum, remarks: string) {
        super(username, unitCode, companyCode, userId);
        this.irId = irId;
        this.insCurrentActivity = insCurrentActivity;
        this.remarks = remarks;
        this.changeDateTime = changeDateTime;
    }
}