import { GlobalResponseObject } from "../../common";
import { SewSerialProductOpsModel } from "./sew-serial-prodcut-ops.model";

export class SewSerialOpsResponse extends GlobalResponseObject {
    data: SewSerialProductOpsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewSerialProductOpsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
