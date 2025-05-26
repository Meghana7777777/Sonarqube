import { GlobalResponseObject } from "../../../common";
import { InsInspectionBasicInfoModel, ThreadInspectionBasicInfoModel, TrimInspectionBasicInfoModel, YarnInspectionBasicInfoModel } from "./inspection-basic-info.model";

export class    InsInspectionBasicInfoResponse extends GlobalResponseObject {
    data ?: InsInspectionBasicInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: InsInspectionBasicInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
} 


export class YarnInspectionBasicInfoResponse extends GlobalResponseObject {
    data ?: YarnInspectionBasicInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: YarnInspectionBasicInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
} 


export class ThreadInspectionBasicInfoResponse extends GlobalResponseObject {
    data ?: ThreadInspectionBasicInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ThreadInspectionBasicInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class TrimInspectionBasicInfoResponse extends GlobalResponseObject {
    data ?: TrimInspectionBasicInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: TrimInspectionBasicInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
} 