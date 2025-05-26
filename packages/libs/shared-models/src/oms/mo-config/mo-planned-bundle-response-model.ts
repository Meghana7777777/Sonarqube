import { GlobalResponseObject } from "../../common";
import { PlannedBundleModel } from "./mo-planned-bundle-view-model";

export class PlannedBundleResponseModel extends GlobalResponseObject{
    data: PlannedBundleModel[];
    constructor(status: boolean,     errorCode: number, internalMessage: string, data: PlannedBundleModel[]){
        super(status,errorCode, internalMessage)
        this.data = data
    }
}