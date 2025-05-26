import { GlobalResponseObject } from "../../../common";
import { MaterialAllocatedDocketModel, PlannedCutsModel } from "./material-allocated-dockets.model";
import { TotalLayedMeterageModel } from "./total-layed-meterage.model";

export class MaterialAllocatedDocketsResponse extends GlobalResponseObject {
    data : MaterialAllocatedDocketModel

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MaterialAllocatedDocketModel) {
        super(status, errorCode, internalMessage);
        this.data = data;

    }

}


export class PlannedDocketInfoResponse extends GlobalResponseObject {
    data : PlannedCutsModel

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PlannedCutsModel) {
        super(status, errorCode, internalMessage);
        this.data = data;

    }

}













