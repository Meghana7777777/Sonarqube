import { CommonRequestAttrs, PhItemCategoryEnum } from "../../common";
import { InsConfigFabValModel, InsConfigValModel } from "./ins-config.model";

export class InsFabInsConfigRequest extends CommonRequestAttrs {
    supplierCode: string;
    plRefId: number;
    itemCategory: PhItemCategoryEnum;
    insConfigs: InsConfigFabValModel[];

    constructor(username: string, unitCode: string, companyCode: string, userId: number, supplierCode: string,
        insConfigs: InsConfigFabValModel[], plRefId: number, itemCategory: PhItemCategoryEnum) {
        super(username, unitCode, companyCode, userId);
        this.supplierCode = supplierCode;
        this.insConfigs = insConfigs;
        this.plRefId = plRefId;
        this.itemCategory = itemCategory
    }
}