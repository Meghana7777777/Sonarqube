import { CommonRequestAttrs } from "../../../../common";

export class RemarkDocketGroupModel extends CommonRequestAttrs{
    id?: number;
    docGroup: string;
    remark: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,   docGroup: string, remark: string) {

        super(username, unitCode, companyCode, userId);
        this.docGroup=docGroup;
        this.remark=remark;
        
        

    }
}