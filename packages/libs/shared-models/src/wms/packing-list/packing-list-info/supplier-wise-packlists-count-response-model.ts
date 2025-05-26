import { GlobalResponseObject } from "../../../common";
import { SupplierWisePackListsCountReqIdDto } from "./supplier-wise-packlists-count-model";

export class SupplierWisePackListsCountResponse extends GlobalResponseObject {
    data?: SupplierWisePackListsCountReqIdDto

    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: SupplierWisePackListsCountReqIdDto) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}