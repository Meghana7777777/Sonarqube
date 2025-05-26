import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { StockObjectInfoModel } from "./stock-object-info.model";


export class StockObjectInfoResponse extends GlobalResponseObject {
    data: StockObjectInfoModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: StockObjectInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}