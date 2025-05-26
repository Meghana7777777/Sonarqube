import { CommonRequestAttrs } from "../../../common";
import { MarkerTypeModel } from "./marker-type.model";

export class MarkerTypeCreateRequest extends CommonRequestAttrs {
    markerTypes: MarkerTypeModel[]; // not required during create
    
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        markerTypes: MarkerTypeModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.markerTypes = markerTypes;
    }
}