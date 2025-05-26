import { CommonRequestAttrs, FGItemCategoryEnum, PhItemCategoryEnum } from "../../common";
import { InsConfigValModel } from "./ins-config.model";

export class InsFgInsConfigRequest extends CommonRequestAttrs {
    buyerCode: string;
    plRefId?: number;
    insConfigs: InsConfigValModel[];
    itemCategory: PhItemCategoryEnum | FGItemCategoryEnum
    constructor(username: string, unitCode: string, companyCode: string, userId: number, buyerCode: string, insConfigs: InsConfigValModel[], plRefId: number, itemCategory: PhItemCategoryEnum | FGItemCategoryEnum) {
        super(username, unitCode, companyCode, userId);
        this.buyerCode = buyerCode;
        this.insConfigs = insConfigs;
        this.plRefId = plRefId;
        this.itemCategory = itemCategory;
    }
}
