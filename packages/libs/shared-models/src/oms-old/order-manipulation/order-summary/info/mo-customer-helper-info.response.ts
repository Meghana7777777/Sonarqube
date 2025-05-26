import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { MoCustomerInfoHelperModel } from "./mo-customer-helper-info.model";

export class MoCustomerInfoHelperResponse extends GlobalResponseObject {
    data?: MoCustomerInfoHelperModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MoCustomerInfoHelperModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
