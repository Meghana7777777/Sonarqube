import { CompanyModel } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../common/common-request-attr.model";

export class CompanyCreateRequest extends CommonRequestAttrs {
    companys: CompanyModel[];

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        companys: CompanyModel[]
    ) {
        super(userName, unitCode, companyCode, userId);
        this.companys = companys;
    }
}