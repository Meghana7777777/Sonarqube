import { GlobalResponseObject } from "../../../common";
import { MaterialInWhAndComparisonModel } from "./material-in-wh-and-comparision.model";
import { MaterialInWhInfoModel } from "./material-in-wh-info.model";

export class MaterialInWarehouseInfoResponse extends GlobalResponseObject{
    data : MaterialInWhAndComparisonModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MaterialInWhAndComparisonModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   