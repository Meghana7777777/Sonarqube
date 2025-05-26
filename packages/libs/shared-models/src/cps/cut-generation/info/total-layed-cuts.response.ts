import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { TotalLayedCutsModel } from "./total-layed-cuts.model";

 

export class TotalLayedCutsResponse extends GlobalResponseObject {
    data : TotalLayedCutsModel

    constructor(status: boolean, errorCode: number, internalMessage: string, data: TotalLayedCutsModel) {
        super(status, errorCode, internalMessage);
        this.data = data;

    }

}