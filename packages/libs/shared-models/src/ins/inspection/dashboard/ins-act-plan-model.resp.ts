import { GlobalResponseObject } from "../../../common";
import { InsInspActPlanModel } from "./insp-act-plan-model";

export class InsInsActPlanModelResp extends GlobalResponseObject {
    data ?: InsInspActPlanModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: InsInspActPlanModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}