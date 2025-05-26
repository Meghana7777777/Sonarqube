import { GlobalResponseObject } from "../../../common";
import { SewingJobPropsModel } from "./sewing-job-props.model";

export class SewingJobPropsResp extends GlobalResponseObject {
    data: SewingJobPropsModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewingJobPropsModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}