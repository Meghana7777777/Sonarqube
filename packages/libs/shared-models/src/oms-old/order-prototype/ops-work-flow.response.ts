import { GlobalResponseObject } from "../../common";
import { GlobalOpsVersion } from "./ops-work-flow.models";
import { ProductItemModel } from "./product-item.model";

export class OpsWorkFlowResponse extends GlobalResponseObject {
    data?: GlobalOpsVersion;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: GlobalOpsVersion) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
