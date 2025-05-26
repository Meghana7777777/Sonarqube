import { CommonRequestAttrs } from "../../common";

export class MorderSewSerialRequest extends CommonRequestAttrs{
    orderRefNo: string;
    orderLineRefNo: string
    constructor(username: string, unitCode: string, companyCode: string, userId: number, orderRefNo: string, orderLineRefNo: string) {
        super(username, unitCode, companyCode, userId);
        this.orderRefNo = orderRefNo;
        this.orderLineRefNo = orderLineRefNo
    }
}

export class DownTimeDetailsReq extends CommonRequestAttrs{
    dates: string[];
    section: string
    constructor(username: string, unitCode: string, companyCode: string, userId: number, dates: string[], section: string) {
        super(username, unitCode, companyCode, userId);
        this.dates = dates;
        this.section = section
    }
}