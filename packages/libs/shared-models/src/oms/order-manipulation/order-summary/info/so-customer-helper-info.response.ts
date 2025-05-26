import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { SoCustomerInfoHelperModel } from "./so-customer-helper-info.model";

export class SoCustomerInfoHelperResponse extends GlobalResponseObject {
    data?: SoCustomerInfoHelperModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SoCustomerInfoHelperModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
