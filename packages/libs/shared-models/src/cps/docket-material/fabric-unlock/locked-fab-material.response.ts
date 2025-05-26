import { GlobalResponseObject } from "../../../common";
import { LockedFabMaterialModel } from "./locked-fab-material.model";

export class LockedFabMaterialResponse extends GlobalResponseObject {
    data ?: LockedFabMaterialModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: LockedFabMaterialModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}