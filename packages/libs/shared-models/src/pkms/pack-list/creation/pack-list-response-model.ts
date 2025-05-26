import { PackListCreateModel } from "@xpparel/shared-models";
import { GlobalResponseObject } from "../../../common";

export class PackListResponseModel extends GlobalResponseObject {
    data?: PackListCreateModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PackListCreateModel) {
        super(status, errorCode, internalMessage)
        this.data = data
    }
}