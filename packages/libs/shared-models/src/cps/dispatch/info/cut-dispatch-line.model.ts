import { CutDispatchStatusEnum } from "../../enum";

export class CutDispatchLineModel {
    dispatchLineId: number;
    moNo: string;
    moLines: string[];
    cutNumber: number;
    poSerial: number;
    cutDispacthStatus: CutDispatchStatusEnum;
    reqCreatedOn: string; // YYYY-MM-DD HH:MM:SS
    dockets: string[];
    mainRefDocket: string;
    cutQty: number;
    totalShadeBundles: number;
    bagNumber: string;


    constructor(
        dispatchLineId: number,
        moNo: string,
        moLines: string[],
        cutNumber: number,
        poSerial: number,
        cutDispacthStatus: CutDispatchStatusEnum,
        reqCreatedOn: string, // YYYY-MM-DD HH:MM:SS
        dockets: string[],
        mainRefDocket: string,
        cutQty: number,
        totalShadeBundles: number,
        bagNumber: string,
    ) {
        this.dispatchLineId = dispatchLineId;
        this.moNo = moNo;
        this.moLines = moLines;
        this.cutNumber = cutNumber;
        this.poSerial = poSerial;
        this.cutDispacthStatus = cutDispacthStatus;
        this.reqCreatedOn = reqCreatedOn;
        this.dockets = dockets;
        this.mainRefDocket = mainRefDocket;
        this.cutQty = cutQty;
        this.totalShadeBundles = totalShadeBundles;
        this.bagNumber = bagNumber;
    }
}

