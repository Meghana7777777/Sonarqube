import { CommonRequestAttrs } from "../../common";
import {  PkmsFgWhCurrStageEnum } from "../../pkms";

export class FgWhStageReq extends CommonRequestAttrs {
    currentStage: PkmsFgWhCurrStageEnum;
    requestId : number;
     constructor(username: string, unitCode: string, companyCode: string, userId: number,currentStage :PkmsFgWhCurrStageEnum,requestId :number) {
            super(username, unitCode, companyCode, userId)
            this.currentStage = currentStage;
            this.requestId = requestId;
        }
}