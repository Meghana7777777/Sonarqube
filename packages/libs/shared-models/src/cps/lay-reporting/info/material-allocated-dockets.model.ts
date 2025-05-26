export class MaterialAllocatedDocketModel {
    docketGroup: number;
    constructor(docketGroup: number
    ) {
        this.docketGroup = docketGroup;
    }
}


export class PlannedRequestModel {
    requestNumber: string;
    constructor(requestNumber: string ) {
        this.requestNumber = requestNumber;
    }
}

export class PlannedCutsModel {
    totalPlannedCuts: number;
    totalPlannedQty: number;
    constructor(totalPlannedCuts: number, totalPlannedQty:number ) {
        this.totalPlannedCuts = totalPlannedCuts;
        this.totalPlannedQty = totalPlannedQty;
    }
}