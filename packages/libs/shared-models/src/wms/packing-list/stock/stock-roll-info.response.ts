import { StockRollInfoModel } from "@xpparel/shared-models";
import { GlobalResponseObject } from "packages/libs/shared-models/src/common";


export class StockRollInfoResponse extends GlobalResponseObject {
    data: StockRollInfoModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: StockRollInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}