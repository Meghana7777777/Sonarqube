import { CommonRequestAttrs } from "../../common";

export class EscalltionChangeRequest extends CommonRequestAttrs {
    id: number;
    escalationType: string;
    style: string;
    buyer: string;
    workOrder: string;
    qualityType: string;
    escalationPercentage: string;
    escalationPerson: string;
    versionFlag?: number;
    isActive?: boolean;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id: number,
        escalationType: string,
        style: string,
        buyer: string,
        workOrder: string,
        qualityType: string,
        escalationPercentage: string,
        escalationPerson: string,
        versionFlag?: number,
        isActive?: boolean,
    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id
        this.escalationType = escalationType;
        this.style = style;
        this.buyer = buyer;
        this.workOrder = workOrder;
        this.qualityType = qualityType;
        this.escalationPercentage = escalationPercentage;
        this.escalationPerson = escalationPerson;
        this.versionFlag = versionFlag;
        this.isActive = isActive;
    }
}