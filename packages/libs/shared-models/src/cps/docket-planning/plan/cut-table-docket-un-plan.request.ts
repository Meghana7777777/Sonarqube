import { CommonRequestAttrs } from "../../../common";
import { DocketPriorityModel } from "./docket-priority.model";

export class CutTableDocketUnPlanRequest extends CommonRequestAttrs {
    docketsList: DocketPriorityModel[]; // usually only 1 unplan at a time
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        docketsList: DocketPriorityModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.docketsList = docketsList;
    }
}