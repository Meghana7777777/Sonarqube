import { CommonRequestAttrs, PhItemCategoryEnum } from "../../common";
import { InsConfigFabValModel, InsConfigThreadValModel, InsConfigValModel, InsConfigYarnValModel } from "./ins-config.model";

export class InsYarnInsConfigRequest extends CommonRequestAttrs {
    supplierCode: string;
    plRefId: number;
    insConfigs: InsConfigYarnValModel[];
    itemCategory: PhItemCategoryEnum
    constructor(username: string, unitCode: string, companyCode: string, userId: number, supplierCode: string, insConfigs: InsConfigYarnValModel[],plRefId:number,itemCategory: PhItemCategoryEnum) {
        super(username, unitCode, companyCode, userId);
        this.supplierCode = supplierCode;
        this.insConfigs = insConfigs;
        this.plRefId = plRefId;
        this.itemCategory = itemCategory;
    }
}