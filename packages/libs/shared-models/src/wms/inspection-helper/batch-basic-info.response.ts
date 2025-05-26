import { GlobalResponseObject } from "../../common";


export class BatchBasicInfoRespone extends GlobalResponseObject {
    data?: BatchBasicInfoModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: BatchBasicInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class BatchBasicInfoModel {
    id: number;
    deliveryDate: string;
    batchNumber: string;
    invoiceNumber: string;
    invoiceDate: string;
    remarks: string;
    batchQty: number;
    noOfLots: number;
}
