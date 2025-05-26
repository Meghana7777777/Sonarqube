import { CommonRequestAttrs } from "../../common";

// Used to get the rolls info / rolls based on the given parameters
export class PlBatchLotRequest extends CommonRequestAttrs {
    // Can retrieve pack list based rolls
    // can retrieve pack list + bacthes rolls
    // can retrieve pack list + lots rolls
    packListId: number; // mandatory
    batchNos?: string[]; // optional
    lotNos?: string[]; // optional

    constructor(username: string, unitCode: string, companyCode: string, userId: number, packListId: number, batchNos?: string[], lotNos?: string[]) {
        super(username, unitCode, companyCode, userId);
        this.packListId=packListId;
        this.batchNos=batchNos;
        this.lotNos=lotNos;
    }

}

