import { CommonRequestAttrs, FGItemCategoryEnum, PhItemCategoryEnum } from "../../common";

export class InsSupplierCodeRequest extends CommonRequestAttrs {
    supplierCode: string;
    plRefId: number;
    itemCategory: PhItemCategoryEnum | FGItemCategoryEnum;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, supplierCode: string, plRefId: number, itemCategory: PhItemCategoryEnum | FGItemCategoryEnum) {
        super(username, unitCode, companyCode, userId);
        this.supplierCode = supplierCode;
        this.plRefId = plRefId;
        this.itemCategory = itemCategory;
    }
}