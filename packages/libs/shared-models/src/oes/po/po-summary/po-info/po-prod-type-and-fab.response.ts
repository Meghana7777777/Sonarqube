import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { PoProdTypeAndFabModel } from "./po-prod-types-and-fab.model";

export class PoProdTypeAndFabResponse extends GlobalResponseObject {
    data ?: PoProdTypeAndFabModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoProdTypeAndFabModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}