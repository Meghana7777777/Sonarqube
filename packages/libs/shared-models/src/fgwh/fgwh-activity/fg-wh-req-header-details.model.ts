import { CommonRequestAttrs } from "../../common";
import { PkmsFgWhReqApprovalEnum, PkmsFgWhCurrStageEnum, PkmsFgWhReqTypeEnum } from "../../pkms";

export class FgWhReqHeaderDetailsModel extends CommonRequestAttrs {
    requestNo: string;
    fromWhCode: string;
    toWhCode: string;
    approvedBy: string;
    requestApprovalStatus: PkmsFgWhReqApprovalEnum;
    reqType: PkmsFgWhReqTypeEnum
    requestId: number
    currentStage: PkmsFgWhCurrStageEnum
    totalCartons: number;
    pendingCartons: number;
    scannedCartons: number;
    destination: string;
    buyerPo: string;
    buyer: string;
    style: string;
    deliveryDate: string;
    moNumber: string
    scanStartTime?: string;
    pendingCartonBarCodes: string[];
    completedBarCodes: string[];
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        requestNo: string,
        fromWhCode: string,
        toWhCode: string,
        approvedBy: string,
        requestApprovalStatus: PkmsFgWhReqApprovalEnum,
        reqType: PkmsFgWhReqTypeEnum,
        requestId: number,
        currentStage: PkmsFgWhCurrStageEnum,
        totalCartons: number,
        pendingCartons: number,
        scannedCartons: number,
        destination: string,
        buyerPo: string,
        buyer: string,
        style: string,
        deliveryDate: string,
        moNumber: string,
        scanStartTime?: string,
        pendingCartonBarCodes?: string[],
        completedBarCodes?: string[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.requestNo = requestNo
        this.reqType = reqType
        this.approvedBy = approvedBy
        this.requestApprovalStatus = requestApprovalStatus
        this.fromWhCode = fromWhCode
        this.toWhCode = toWhCode
        this.requestId = requestId
        this.currentStage = currentStage
        this.totalCartons = totalCartons
        this.pendingCartons = pendingCartons
        this.scannedCartons = scannedCartons
        this.destination = destination
        this.buyer = buyer
        this.buyerPo = buyerPo
        this.style = style
        this.deliveryDate = deliveryDate
        this.moNumber = moNumber;
        this.scanStartTime = scanStartTime;
        this.pendingCartonBarCodes = pendingCartonBarCodes;
        this.completedBarCodes = completedBarCodes;
    }
}