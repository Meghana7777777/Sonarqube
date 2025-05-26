import { CommonRequestAttrs } from "../../common";
import { InspectionLevelEnum } from "../enum/inspection-level.enum";
import { RollGrnAndInsRequest } from "./roll-grn-ins.request";


export class RollsGrnRequest extends CommonRequestAttrs {
    phId: number;
    rollsGrnInfo: RollGrnAndInsRequest[];
    inspectionLevel: InspectionLevelEnum;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, phId: number, rollsGrnInfo: RollGrnAndInsRequest[], inspectionLevel: InspectionLevelEnum) {
        super(username, unitCode, companyCode, userId);
        this.phId = phId;
        this.rollsGrnInfo = rollsGrnInfo;
        this.inspectionLevel = inspectionLevel;
    }
}
