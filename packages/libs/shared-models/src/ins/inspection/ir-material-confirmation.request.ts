import { CommonRequestAttrs } from "../../common";

export class InsIrMaterialConfirmationRequest extends CommonRequestAttrs {
    confirmedDate: string;
    irId: number;
    remarks: string;
    
    constructor(username: string, unitCode: string, companyCode: string, userId: number, confirmedDate : string, irId: number, remarks:string){
        super(username,unitCode,companyCode,userId);
        this.confirmedDate = confirmedDate;
        this.irId = irId;
        this.remarks = remarks;
    }
}

