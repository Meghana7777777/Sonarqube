import { GlobalResponseObject } from "../../common";
import { InsRollInspectionInfo, ThreadInsRollInspectionInfo, TrimInsRollInspectionInfo, YarnInsRollInspectionInfo } from "./roll-inspection-info.model";

export class InsGetInspectionHeaderRollInfoResp extends GlobalResponseObject {
    data : InsRollInspectionInfo;
    constructor(status: boolean, errorCode: number, internalMessage: string, data: InsRollInspectionInfo) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
} 


export class YarnInspectionHeaderRollInfoResp extends GlobalResponseObject {
    data : YarnInsRollInspectionInfo;
    constructor(status: boolean, errorCode: number, internalMessage: string, data: YarnInsRollInspectionInfo) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class ThreadInspectionHeaderRollInfoResp extends GlobalResponseObject {
    data : ThreadInsRollInspectionInfo;
    constructor(status: boolean, errorCode: number, internalMessage: string, data: ThreadInsRollInspectionInfo) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
} 

export class TrimInspectionHeaderRollInfoResp extends GlobalResponseObject {
    data : TrimInsRollInspectionInfo;
    constructor(status: boolean, errorCode: number, internalMessage: string, data: TrimInsRollInspectionInfo) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}