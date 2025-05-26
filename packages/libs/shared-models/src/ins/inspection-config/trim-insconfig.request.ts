import { CommonRequestAttrs, PhItemCategoryEnum } from "../../common";
import { InsConfigTrimValModel } from "./ins-config.model";

export class InsTrimInsConfigRequest extends CommonRequestAttrs {
    supplierCode: string;
    insConfigs: InsConfigTrimValModel[];
    itemCategory: PhItemCategoryEnum;
    plRefId: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, supplierCode: string, insConfigs: InsConfigTrimValModel[],
        plRefId: number, itemCategory: PhItemCategoryEnum) {
        super(username, unitCode, companyCode, userId);
        this.supplierCode = supplierCode;
        this.insConfigs = insConfigs;
        this.plRefId = plRefId;
        this.itemCategory = itemCategory;
    }
}
