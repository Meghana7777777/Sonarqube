import { CartonDataModel, CartonLocationModel, GlobalResponseObject, InsCartonDataModel } from "@xpparel/shared-models";

export class InsCartonsDataResponse extends GlobalResponseObject {
    data?: InsCartonDataModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: InsCartonDataModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}