import { CommonRequestAttrs } from "../../common";
import { RequestTypeEnum } from "../enum/request-type.enum";

export class RollIdsConsumptionRequest extends CommonRequestAttrs {
    rollIds: number[];
    requestNumber : string;
    requestType: RequestTypeEnum;
    lastIssuanceDate: string;
    isReversal: boolean;


    constructor(username: string, unitCode: string, companyCode: string, userId: number, rollIds: number[],  requestNumber: string, requestType: RequestTypeEnum, lastIssuanceDate: string, isReversal: boolean) {
        super(username, unitCode, companyCode, userId)
        this.rollIds = rollIds;
        this.requestNumber = requestNumber;
        this.requestType = requestType;
        this.lastIssuanceDate = lastIssuanceDate;
        this.isReversal = isReversal;
    }
}
