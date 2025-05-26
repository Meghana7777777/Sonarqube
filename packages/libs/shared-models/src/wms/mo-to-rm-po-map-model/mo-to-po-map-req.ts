import { CommonRequestAttrs } from "../../common";
import { MOToPOMappingModel } from "./mo-to-po-map-model";

export class MOToPOMappingReq extends CommonRequestAttrs {
    mappingData: MOToPOMappingModel[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, mappingData: MOToPOMappingModel[]) {
        super(username, unitCode, companyCode, userId);
        this.mappingData = mappingData;
    }
}