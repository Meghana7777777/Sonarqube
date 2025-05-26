import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { PoSizesModel } from "./po-sizes.model";

export class PoSizesResponse extends GlobalResponseObject {
    data ?: PoSizesModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoSizesModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}