import { GlobalResponseObject } from "../../common";
import { SewingOrderDetailsForGivenFeatureGroup } from "./sewing-job-gen-for-actuals.models";

export class SewOrderDetailForFeatureGroupResponse extends GlobalResponseObject {
    data: SewingOrderDetailsForGivenFeatureGroup;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewingOrderDetailsForGivenFeatureGroup) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}