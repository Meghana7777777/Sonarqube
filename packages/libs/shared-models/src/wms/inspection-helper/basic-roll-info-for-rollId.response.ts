import { GlobalResponseObject } from "../../common";

export class BasicRollInfoRespone extends GlobalResponseObject {
    data?: BasicRollInfoModel;
    constructor(status: boolean, errorCode: number, internalMessage: string, data: BasicRollInfoModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class BasicRollInfoModel {
    barcode: string;
    qr_code: string;
    object_ext_no: number;
    lot_number: string;
    quantity: number;
    s_width: number;
    s_shade: string;
}