import { CommonRequestAttrs, PackingMethodsEnum } from "../../../common";
import { CartonPrototypeWeightModel } from "./carton-proto-weight.model";

export class PlCartonWeightModel extends CommonRequestAttrs {
    plConfigId: number;
    plConfigNo: string;
    plConfigDesc: string;
    poId: number;
    packSerial: number;
    poDate: string;
    qty: number;
    specId: number;
    packType: number;
    packMethod: PackingMethodsEnum;
    noOfCartons: number;
    packJobQty: number;
    packJobs: number;
    cartonProtoModels: CartonPrototypeWeightModel[];
    printStatus: boolean;
    constructor(
        plConfigId: number,
        plConfigNo: string,
        plConfigDesc: string,
        poId: number,
        packSerial: number,
        poDate: string,
        qty: number,
        specId: number,
        packType: number,
        packMethod: PackingMethodsEnum,
        noOfCartons: number,
        packJobQty: number,
        packJobs: number,
        cartonProtoModels: CartonPrototypeWeightModel[],
        companyCode: string,
        unitCode: string,
        userId: number,
        username: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.plConfigId = plConfigId;
        this.plConfigNo = plConfigNo;
        this.plConfigDesc = plConfigDesc;
        this.poId = poId;
        this.packSerial = packSerial;
        this.poDate = poDate;
        this.qty = qty;
        this.specId = specId;
        this.packType = packType;
        this.packMethod = packMethod;
        this.noOfCartons = noOfCartons;
        this.packJobQty = packJobQty;
        this.packJobs = packJobs;
        this.cartonProtoModels = cartonProtoModels;
    }
}