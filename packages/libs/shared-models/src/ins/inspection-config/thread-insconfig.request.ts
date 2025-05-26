import { CommonRequestAttrs, PhItemCategoryEnum } from "../../common";
import { InsConfigFabValModel, InsConfigThreadValModel, InsConfigValModel } from "./ins-config.model";

export class InsThreadInsConfigRequest extends CommonRequestAttrs {
    supplierCode: string;
    plRefId: number;
    insConfigs: InsConfigThreadValModel[];
    itemCategory: PhItemCategoryEnum;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, supplierCode: string, insConfigs: InsConfigThreadValModel[],plRefId:number,itemCategory: PhItemCategoryEnum) {
        super(username, unitCode, companyCode, userId);
        this.supplierCode = supplierCode;
        this.insConfigs = insConfigs;
        this.plRefId = plRefId;
        this.itemCategory = itemCategory;
    }
}