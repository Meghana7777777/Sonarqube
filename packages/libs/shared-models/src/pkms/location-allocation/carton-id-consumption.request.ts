import { RequestTypeEnum } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../common";

export class CartonIdsConsumptionRequest extends CommonRequestAttrs {
    cartonIds: number[];
    requestNumber : string;
    requestType: RequestTypeEnum;
    lastIssuanceDate: string;
    isReversal: boolean;


    constructor(username: string, unitCode: string, companyCode: string, userId: number, cartonIds: number[],  requestNumber: string, requestType: RequestTypeEnum, lastIssuanceDate: string, isReversal: boolean) {
        super(username, unitCode, companyCode, userId)
        this.cartonIds = cartonIds;
        this.requestNumber = requestNumber;
        this.requestType = requestType;
        this.lastIssuanceDate = lastIssuanceDate;
        this.isReversal = isReversal;
    }
}
