import { GlobalResponseObject } from "../../../common";
import { SewingJobOperationWiseSummaryModel } from "./sewing-job-operation-wise-summary.model";
import { SewingJobSizeWiseSummaryModel } from "./sewing-job-size-wise-summary.model";

export class SewingJobSizeWiseSummaryResponse extends GlobalResponseObject {
    data: SewingJobSizeWiseSummaryModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewingJobSizeWiseSummaryModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class SewingJobOperationWiseSummaryResponse extends GlobalResponseObject {
    data: SewingJobOperationWiseSummaryModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewingJobOperationWiseSummaryModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}