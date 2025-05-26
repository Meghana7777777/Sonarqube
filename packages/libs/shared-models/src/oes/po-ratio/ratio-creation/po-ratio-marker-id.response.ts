
import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { PoRatioMarkerIdModel } from "./po-ratio-marker-id.model";

export class PoRatioMarkerIdResponse extends GlobalResponseObject {
    data ?: PoRatioMarkerIdModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoRatioMarkerIdModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}