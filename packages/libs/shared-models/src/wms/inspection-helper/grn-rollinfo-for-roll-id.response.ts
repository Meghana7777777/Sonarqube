import { GlobalResponseObject } from "../../common";

export class  GrnRollInfoForRollResp extends GlobalResponseObject {
    data?: GrnRollInfoQryResp[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: GrnRollInfoQryResp[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }

}



export class GrnRollInfoQryResp {
    ph_id: number;
    s_length: number;
    roll_number: number;
    s_width: number;
    s_shade: string;
    gsm: number;
    measured_width: number;
    barcode : string;
}