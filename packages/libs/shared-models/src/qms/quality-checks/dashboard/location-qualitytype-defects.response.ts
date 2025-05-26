import { GlobalResponseObject } from "../../../common";
import { QMS_LocVsQualitytypeDefectsModel } from "./location-qualitytype-defects.model";

export class QMS_LocVsQualitytypeDefectsResponse extends GlobalResponseObject {
    data: QMS_LocVsQualitytypeDefectsModel[]


    constructor(status: boolean, errorCode: number, internalMessage: string, data: QMS_LocVsQualitytypeDefectsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }

}