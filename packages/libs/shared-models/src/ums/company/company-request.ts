import { CommonRequestAttrs } from "../../common";
import { CompanyModel } from "./company-model";

export class CompanyRequest extends CommonRequestAttrs{
    company: CompanyModel

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        company: CompanyModel
    ) {
        super(userName, unitCode, companyCode, userId);
        this.company = company;
    }
    
}