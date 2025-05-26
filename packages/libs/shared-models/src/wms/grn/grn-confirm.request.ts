import { CommonRequestAttrs } from "../../common";


export class GrnConfirmRequest extends CommonRequestAttrs{
    phId: number;
    grnNo: string;
    confirmed: boolean;
    grnDate: Date;
    remarks: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,phId: number,grnNo: string,confirmed: boolean, grnDate: Date, remarks: string){
        super(username,unitCode,companyCode,userId);
        this.phId=phId;
        this.grnNo=grnNo;
        this.confirmed=confirmed;
        this.grnDate = grnDate;
        this.remarks = remarks;
    }
}