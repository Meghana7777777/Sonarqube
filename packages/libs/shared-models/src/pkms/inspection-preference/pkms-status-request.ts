import { CommonRequestAttrs } from "../../common"; 
import { PKMSRequestStatusEnum } from "../enum";

export class PKMSStatusRequest extends CommonRequestAttrs {
    rollNo : string;
    createdAt : string;
    status : PKMSRequestStatusEnum;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, roolNo : string, createdAt: string, status:PKMSRequestStatusEnum){

        super(username,unitCode,companyCode,userId)
        this.rollNo = roolNo;
        this.createdAt = createdAt;
        this.status = status;
    }
}