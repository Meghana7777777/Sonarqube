import { CompanyModel } from "@xpparel/shared-models";
import { GlobalResponseObject } from "../../common";

export class CompanyResponse extends GlobalResponseObject {
    data?: CompanyModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: CompanyModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}