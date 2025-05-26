import { CommonRequestAttrs } from "../../../common";
import { MaterialTypeEnum } from "../../enum";

export class MaterialReqModel extends CommonRequestAttrs {
    category: MaterialTypeEnum

    constructor(
        category: MaterialTypeEnum,
        username: string,
        userId: number,
        unitCode: string,
        companyCode: string
    ) {
        super(username, unitCode, companyCode, userId)
        this.category = category;
    }
}