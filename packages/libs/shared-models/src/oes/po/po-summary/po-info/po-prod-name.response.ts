import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { PoProdNameModel } from "./po-prod-name.model";

export class PoProdNameResponse extends GlobalResponseObject {
    data ?: PoProdNameModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoProdNameModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}