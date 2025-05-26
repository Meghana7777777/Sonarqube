
import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum } from "../../oms";

// {
//     "allocationId": 1,
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "reqRefId": 1
//     "issuedOn": "2025-05-22",
//     "toProcType": "EMB",
//     "fromProcType": ["CUT"]
// }

export class PTS_C_InvIssuanceRefCreateRequest extends CommonRequestAttrs {
    allocationId: number; // pk of the invs inv_out_allocation
    reqRefId: number; //PK of the wh req header id
    issuedOn: string;
    toProcType: ProcessTypeEnum;
    fromProcType: ProcessTypeEnum[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        allocationId: number,
        reqRefId: number,
        issuedOn: string,
        toProcType: ProcessTypeEnum,
        fromProcType: ProcessTypeEnum[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.allocationId = allocationId;
        this.reqRefId = reqRefId;
        this.issuedOn = issuedOn;
        this.toProcType = toProcType;
        this.fromProcType = fromProcType;
    }
}