
export class EscallationDto {
    id: number;
    escalationType: string;
    style: string;
    buyer: string;
    workOrder: string;
    qualityType: string;
    escalationPercentage: string;
    escalationPerson: string;
    versionFlag: number;
    isActive: boolean;
    constructor(
        id: number,
        escalationType: string,
        style: string,
        buyer: string,
        workOrder: string,
        qualityType: string,
        escalationPercentage: string,
        escalationPerson: string,
        versionFlag: number,
        isActive: boolean,
    ) {
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

export class EscallationActivateDeactivateDto {
    id: number
    isActive?: boolean
    versionFlag?: number


    constructor(id: number, isActive?: boolean, versionFlag?: number) {
        this.id = id;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
    }

}