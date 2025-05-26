import { GlobalResponseObject } from "../../common";
import { PtsBankRequestDepJobModel } from "./pts-bank-req-create.request";

export class PtsBankElgResponse extends GlobalResponseObject {
    data?: PtsBankRequestDepJobModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PtsBankRequestDepJobModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

