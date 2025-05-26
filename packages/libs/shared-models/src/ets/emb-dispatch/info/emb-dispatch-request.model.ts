import { EmbDispatchStatusEnum } from "../../enum";
import { EmbDispacthLineModel } from "./emb-dispatch-line.model";

export class EmbDispatchRequestModel {
    dispatchReqNo: string; 
    embLineIds: number[];
    supplierId: number;
    moNo: string;
    moLines: string[];
    embJobNumbers: string[];
    dockets: string[];
    docketGroup: string;
    status: EmbDispatchStatusEnum;
    
    gatePassPrintStatus: boolean;
    dispatchLines: EmbDispacthLineModel[];
    dispatchReqId: number;
    dispatchReqCreatedOn: string;
    dispatchSentOutOn: string;
    dispatchReceivedInOn: string;

    constructor(
        dispatchReqNo: string, 
        embLineIds: number[],
        supplierId: number,
        moNo: string,
        moLines: string[],
        embJobNumbers: string[],
        dockets: string[],
        docketGroup: string,
        status: EmbDispatchStatusEnum,
        gatePassPrintStatus: boolean,
        dispatchLines: EmbDispacthLineModel[],
        dispatchReqId: number,
        dispatchReqCreatedOn: string,
        dispatchSentOutOn: string,
        dispatchReceivedInOn: string
    ) {
        this.dispatchReqNo = dispatchReqNo;
        this.embLineIds = embLineIds;
        this.supplierId = supplierId;
        this.moNo = moNo;
        this.moLines = moLines;
        this.embJobNumbers = embJobNumbers;
        this.dockets = dockets;
        this.docketGroup = docketGroup;
        this.status = status;
        this.gatePassPrintStatus = gatePassPrintStatus;
        this.dispatchLines = dispatchLines;
        this.dispatchReqId = dispatchReqId;
        this.dispatchReqCreatedOn = dispatchReqCreatedOn;
        this.dispatchSentOutOn = dispatchSentOutOn;
        this.dispatchReceivedInOn = dispatchReceivedInOn;
    }
}