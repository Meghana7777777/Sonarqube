import { InsConfigFabValModel, InsConfigThreadValModel } from "./ins-config.model";

export class InsThreadInsConfigModel {
    supplierCode: string; // this is set if the ask is 
    supplierName: string;
    plRefId: number;
    insConfigs: InsConfigThreadValModel[];
    constructor(supplierCode: string, supplierName: string, plRefId: number, insConfigs: InsConfigThreadValModel[]) {
        this.supplierCode = supplierCode;
        this.supplierName = supplierName;
        this.insConfigs = insConfigs;
        this.plRefId = plRefId;
    }
}