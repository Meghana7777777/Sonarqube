import { CommonRequestAttrs } from "../../common";
import { RawOrderLineInfoModel } from "./raw-order-line-info.model";

class RevisionOrderLineInfoMode extends RawOrderLineInfoModel {
    revisedQuantity: number
}
export class OrderQtyUpdateModel extends CommonRequestAttrs {
    orderIdPk: number;
    orderNo: string;
    quantity: number;
    extSysRefNo: string;
    orderLines: RevisionOrderLineInfoMode[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        orderIdPk: number,
        orderNo: string,
        quantity: number,
        extSysRefNo: string,
        orderLines: RevisionOrderLineInfoMode[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.orderIdPk = orderIdPk;
        this.orderNo = orderNo;
        this.quantity = quantity;
        this.extSysRefNo = extSysRefNo;
        this.orderLines = orderLines;
    }
}

