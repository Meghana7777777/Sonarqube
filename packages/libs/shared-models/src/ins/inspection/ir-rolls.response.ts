import { GlobalResponseObject } from "../../common";
import { InsIrRollsModel, ThreadInsIrRollsModel, TrimInsIrRollsModel, YarnInsIrRollsModel } from "./ir-rolls.model";

export class InsIrRollsResponse extends GlobalResponseObject{
    data ?: InsIrRollsModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: InsIrRollsModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class YarnInsIrRollsResponse extends GlobalResponseObject{
    data ?: YarnInsIrRollsModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: YarnInsIrRollsModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class ThreadInsIrRollsResponse extends GlobalResponseObject{
    data ?: ThreadInsIrRollsModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ThreadInsIrRollsModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
} 



export class TrimInsIrRollsResponse extends GlobalResponseObject{
    data ?: TrimInsIrRollsModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: TrimInsIrRollsModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}