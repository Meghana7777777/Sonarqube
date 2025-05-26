import { InsConfigFabValModel } from "./ins-config.model";

export class InsFabInsConfigModel {
    supplierCode: string; // this is set if the ask is 
    supplierName: string;
    plRefId: number;
    insConfigs: InsConfigFabValModel[];
    constructor(supplierCode: string, supplierName: string, plRefId: number, insConfigs: InsConfigFabValModel[]) {
        this.supplierCode = supplierCode;
        this.supplierName = supplierName;
        this.insConfigs = insConfigs;
        this.plRefId = plRefId;
    }
}