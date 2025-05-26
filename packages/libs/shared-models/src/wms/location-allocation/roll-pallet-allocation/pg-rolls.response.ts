import { CommonRequestAttrs, GlobalResponseObject } from "../../../common";
import { PgRollsModel } from "./pg-rolls";

export class PgRollsResponse extends GlobalResponseObject {
    data?: PgRollsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PgRollsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
