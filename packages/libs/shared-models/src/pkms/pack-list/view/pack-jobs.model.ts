import { PackListMrnStatusEnum } from "../../enum";
import { PackMatReqStatusEnum } from "../../enum/pack-mat-req-status-enum";
import { CartonPrintModel } from "./carton-print.model";

export class PackJobModel {
    packJobId: number;
    packJobNumber: string;
    poId: number;
    cartons: number;
    priority: number;
    matReqNo: string;
    matReqId: number;
    tableId: number;
    materialReqAt: string;
    plannedDateTime: string;
    materialStatus: PackMatReqStatusEnum;
    printStatus: boolean;
    unPlannedPjs: CartonPrintModel
    totalFgQty: number;
    cartonsPerPackJob: number;
    constructor(
        packJobId: number,
        packJobNumber: string,
        poId: number,
        cartons: number,
        priority: number,
        matReqNo: string,
        matReqId: number,
        materialReqAt: string,
        plannedDateTime: string,
        materialStatus: PackMatReqStatusEnum,
        unPlannedPjs?: CartonPrintModel,
        cartonsPerPackJob?: number
    ) {
        this.packJobId = packJobId;
        this.packJobNumber = packJobNumber;
        this.poId = poId;
        this.cartons = cartons;
        this.priority = priority;
        this.matReqNo = matReqNo;
        this.matReqId = matReqId;
        this.materialReqAt = materialReqAt;
        this.plannedDateTime = plannedDateTime;
        this.materialStatus = materialStatus;
        this.unPlannedPjs = unPlannedPjs;
        this.cartonsPerPackJob = cartonsPerPackJob;
    }
}