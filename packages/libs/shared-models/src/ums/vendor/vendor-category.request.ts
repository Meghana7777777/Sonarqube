import { CommonRequestAttrs } from "../../common";
import { VendorCategoryEnum } from "../enum";

export class VendorCategoryRequest extends CommonRequestAttrs {

    vendorCategory: VendorCategoryEnum;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        vendorCategory: VendorCategoryEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.vendorCategory = vendorCategory;
    }

}