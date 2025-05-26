import { CutDispatchStatusEnum } from "../../enum";
import { CutDispatchLineModel } from "./cut-dispatch-line.model";
import { VehicleDetailsModel } from "./vehicle-details.model";

export interface ICutDipatchCutWiseQtyHelperModel {
    cutNumber: number;
    qty: number;
    totalShadeBundles: number;
}


export interface IPoHelperModel {
    poSerial: number;
    poDesc: string;
}

export class CutDispatchRequestModel {
    cutDispatchId: number;
    dispatchReqNo: string;
    moNo: string;
    moLines: string[];
    cutNumbers: number[];
    prodOrderInfo: IPoHelperModel[];
    cutDispacthStatus: CutDispatchStatusEnum;
    reqCreatedOn: string; // YYYY-MM-DD HH:MM:SS
    dipatchQtys: ICutDipatchCutWiseQtyHelperModel[];
    vendorId: number;
    dispatchNotePrintStatus: boolean;
    dispatchedOn: string; // YYYY-MM-DD HH:MM:SS
    dispatchLines: CutDispatchLineModel[];
    vehiclesInfo: VehicleDetailsModel[];


    constructor(
        cutDispatchId: number,
        dispatchReqNo: string,
        moNo: string,
        moLines: string[],
        cutNumbers: number[],
        prodOrderInfo: IPoHelperModel[],
        cutDispacthStatus: CutDispatchStatusEnum,
        reqCreatedOn: string, // YYYY-MM-DD HH:MM:SS
        dipatchQtys: ICutDipatchCutWiseQtyHelperModel[],
        vendorId: number,
        dispatchNotePrintStatus: boolean,
        dispatchedOn: string,
        dispatchLines: CutDispatchLineModel[],
        vehiclesInfo: VehicleDetailsModel[],
    ) {
        this.cutDispatchId = cutDispatchId;
        this.dispatchReqNo = dispatchReqNo;
        this.moNo = moNo;
        this.moLines = moLines;
        this.cutNumbers = cutNumbers;
        this.prodOrderInfo = prodOrderInfo;
        this.cutDispacthStatus = cutDispacthStatus;
        this.reqCreatedOn = reqCreatedOn;
        this.dipatchQtys = dipatchQtys;
        this.vendorId = vendorId;
        this.dispatchedOn = dispatchedOn;
        this.dispatchNotePrintStatus = dispatchNotePrintStatus;
        this.dispatchLines = dispatchLines;
        this.vehiclesInfo = vehiclesInfo;
    }
}

