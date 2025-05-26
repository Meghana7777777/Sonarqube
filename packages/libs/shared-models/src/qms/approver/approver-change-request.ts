import { CommonRequestAttrs } from "../../common";

export class ApproverChangeRequest extends CommonRequestAttrs {
    id?: number;
    approverName: string;
    emailId: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id: number,
        approverName: string,
        emailId: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.approverName = approverName;
        this.emailId = emailId;
    }
}