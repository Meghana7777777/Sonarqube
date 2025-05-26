import { CommonRequestAttrs } from "../../../common/common-request-attr.model";
import { CustomerModel } from "./customer.model";

export class CustomerCreateRequest extends CommonRequestAttrs {
    customer: CustomerModel[];

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        customer: CustomerModel[]
    ) {
        super(userName, unitCode, companyCode, userId);
        this.customer = customer;
    }
}