import { CommonRequestAttrs } from "../../../common";

export class CustomerIdRequest extends CommonRequestAttrs {
    id?: number;
    customerName?: string;
    customerCode?: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,  
        id?: number,
        customerName?: string,
        customerCode?: string,

    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.customerName = customerName;
        this.customerCode = customerCode;
    }
}