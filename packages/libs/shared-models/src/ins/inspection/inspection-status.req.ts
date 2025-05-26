import { RequestStatusEnum } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../common";
import { InsRequestStatusEnum } from "../enum/ins-requests-status.enum";

export class InsStatusRequest extends CommonRequestAttrs {
    rollNo : string;
    createdAt : string;
    status : InsRequestStatusEnum;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, roolNo : string, createdAt: string, status:InsRequestStatusEnum){
        super(username,unitCode,companyCode,userId)
        this.rollNo = roolNo;
        this.createdAt = createdAt;
        this.status = status;
    }
}