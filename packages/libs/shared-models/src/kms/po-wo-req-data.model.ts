import { WhRequestStatusEnum } from "../common";
import { GlobalResponseObject } from "../common/global-response-object";

export class PoWhRequestData {
    id:number;
    processingSerial: number;
    processType: string;
    requestCode: string;
    requestedBy: string;
    planCloseDate: Date;
    sla: number;
    status: WhRequestStatusEnum;
    createdAt: Date;

    constructor(
        id:number,
        processingSerial: number,
        processType: string,
        requestCode: string,
        requestedBy: string,
        planCloseDate: Date,
        sla: number,
        status: WhRequestStatusEnum,
        createdAt: Date,
    ) {
        this.id = id;
        this.processingSerial = processingSerial;
        this.processType = processType;
        this.requestCode = requestCode;
        this.requestedBy = requestedBy;
        this.planCloseDate = planCloseDate;
        this.sla = sla;
        this.status = status;
        this.createdAt = createdAt;
    }
} 


export class PoWhRequestDataResponse extends GlobalResponseObject {
    data: PoWhRequestData[];
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: PoWhRequestData[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}