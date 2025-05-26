import { GlobalResponseObject } from "../../../common";
import { RackBinPalletsModel } from "./rack-bin-pallets.model";

export class RackBinPalletsResponse extends GlobalResponseObject {
    data?: RackBinPalletsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: RackBinPalletsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

