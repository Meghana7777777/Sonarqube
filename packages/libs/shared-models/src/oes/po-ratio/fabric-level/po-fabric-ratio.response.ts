import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { PoFabricRatioModel } from "./po-fabric-ratio.model";

export class PoFabricRatioResponse extends GlobalResponseObject {
    data ?: PoFabricRatioModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoFabricRatioModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}