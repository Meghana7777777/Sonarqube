import { CommonRequestAttrs } from "../../../common";

export class MarkerTypeIdRequest extends CommonRequestAttrs {
    markerTypeId: number; // not required during create
    
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        markerTypeId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.markerTypeId = markerTypeId;
    }
}