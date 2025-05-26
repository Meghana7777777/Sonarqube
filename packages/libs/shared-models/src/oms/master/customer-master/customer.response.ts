import { GlobalResponseObject } from "../../../common";
import { CustomerDropDownModel, CustomerModel } from "./customer.model";

export class CustomerResponse extends GlobalResponseObject {
    data?: CustomerModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: CustomerModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class CustomerDropDownResponse extends GlobalResponseObject {
    data?: CustomerDropDownModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: CustomerDropDownModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}