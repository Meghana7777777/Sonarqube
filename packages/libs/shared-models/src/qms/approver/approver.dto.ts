export class ApproverDto {
    id?: number;
    approverName?: string;
    emailId?: string;
    versionFlag?: number;
    isActive?: boolean;
    constructor(
        id?: number,
        approverName?: string,
        emailId?: string,
        versionFlag?: number,
        isActive?: boolean,
    ) {
        this.id = id
        this.approverName = approverName;
        this.emailId = emailId;
        this.versionFlag = versionFlag;
        this.isActive = isActive;
    }
}


export class ApproverActivateDeactivateDto {
    id: number
    isActive?: boolean
    versionFlag?: number


    constructor(id: number,isActive?: boolean,versionFlag?: number) {
        this.id = id;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
    }

}