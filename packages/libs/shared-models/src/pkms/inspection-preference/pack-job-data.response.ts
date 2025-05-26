import { GlobalResponseObject } from "../../common";
import { PackJobDataModel } from "./pack-job-data.model";

export class PackJobDataResponse extends GlobalResponseObject{
    data?:PackJobDataModel;
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: PackJobDataModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }r
}









