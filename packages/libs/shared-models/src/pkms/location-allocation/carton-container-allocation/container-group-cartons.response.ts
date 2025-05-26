import { CommonRequestAttrs, GlobalResponseObject } from "../../../common";
import { PgCartonsModel } from "./container-group-cartons";

export class PgCartonsResponse extends GlobalResponseObject {
    data?: PgCartonsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PgCartonsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
