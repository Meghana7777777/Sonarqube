import { GlobalResponseObject } from "../../common"
import { TimeBasedCount } from "./time-based-count";

export class TimeBasedCountResponse extends GlobalResponseObject{

    data?:TimeBasedCount[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: TimeBasedCount[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}

