import { CommonRequestAttrs } from "../../../common";
import { CustomerModel } from "./customer.model";

export class CustomerRequest extends CommonRequestAttrs{
    customer: CustomerModel
    
    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        customer: CustomerModel
    ) {
        super(userName, unitCode, companyCode, userId);
        this.customer = customer;
    }
}