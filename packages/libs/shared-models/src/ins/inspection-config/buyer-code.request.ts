import { CommonRequestAttrs, FGItemCategoryEnum, PhItemCategoryEnum } from "../../common";

export class InsBuyerCodeRequest extends CommonRequestAttrs {
    buyerCode: string;
    plRefId: number;
    itemCategory: PhItemCategoryEnum | FGItemCategoryEnum;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, buyerCode: string, plRefId: number, itemCategory: PhItemCategoryEnum | FGItemCategoryEnum) {
        super(username, unitCode, companyCode, userId);
        this.buyerCode = buyerCode;
        this.plRefId = plRefId;
        this.itemCategory = itemCategory
    }
}