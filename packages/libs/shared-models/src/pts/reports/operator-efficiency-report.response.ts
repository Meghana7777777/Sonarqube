import { GlobalResponseObject, OperatorEfficiencyReportModel } from "@xpparel/shared-models";


export class OperatorEfficiencyResponse extends GlobalResponseObject {
    data?: OperatorEfficiencyReportModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: OperatorEfficiencyReportModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}