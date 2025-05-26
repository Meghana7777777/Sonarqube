import { GlobalResponseObject } from "../../common";
import { QualityConfigurationInfoModel } from "./quality-configuration-info.model";

export class QualityConfigurationInfoResponse extends GlobalResponseObject {
    data?: QualityConfigurationInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: QualityConfigurationInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}