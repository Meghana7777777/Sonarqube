import { GlobalResponseObject, MeasuredRefEnum } from "../../common";

export class RelaxationPointDetailsRespone extends GlobalResponseObject {
    data?: RelaxationPointValuesQryResp;
    constructor(status: boolean, errorCode: number, internalMessage: string, data: RelaxationPointValuesQryResp) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class RelaxationPointValuesQryResp {
    width: number
    measured_ref: MeasuredRefEnum;
    measured_at: number;
    measured_order: number;
}