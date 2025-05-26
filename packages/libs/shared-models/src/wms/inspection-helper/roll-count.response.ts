import { GlobalResponseObject } from "../../common";

export class RollCountResponse extends GlobalResponseObject {
    data?: RollCountModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: RollCountModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class RollCountModel {
    batchNo: string[];
    lotNo: string[];
    rollCount: number;
}

