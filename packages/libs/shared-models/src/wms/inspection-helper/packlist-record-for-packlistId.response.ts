import { GlobalResponseObject } from "../../common";

export class PackListRecordForPackListIdModel {
    packListCode: string;
    supplierCode: string;
}
export class PackListRecordForPackListIdResponse extends GlobalResponseObject {
    data?: PackListRecordForPackListIdModel;
        constructor(status: boolean, errorCode: number, internalMessage: string, data: PackListRecordForPackListIdModel) {
            super(status, errorCode, internalMessage);
            this.data = data;
        }
}