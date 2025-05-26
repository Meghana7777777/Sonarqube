import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { LayedCutsModel } from "./layed-cuts.model";

 

export class LayedCutsResponse extends GlobalResponseObject {
    data : LayedCutsModel

    constructor(status: boolean, errorCode: number, internalMessage: string, data: LayedCutsModel) {
        super(status, errorCode, internalMessage);
        this.data = data;

    }

}