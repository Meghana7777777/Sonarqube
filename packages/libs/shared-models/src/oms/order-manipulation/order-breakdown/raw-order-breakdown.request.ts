import { CommonRequestAttrs } from "../../../common";
import { RawOSLBreakdownnRequest } from "./raw-osl-breakdown.request";

export class RawOrderLineBreakdownRequest extends CommonRequestAttrs {
    orderNo: string;
    orderId?: number;
    oslbreakdown: RawOSLBreakdownnRequest[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        orderNo: string,
        oslbreakdown: RawOSLBreakdownnRequest[],
        orderId?: number,
    ) {
        super(username, unitCode, companyCode, userId);

        this.orderNo = orderNo;
        this.orderId = orderId;
        this.oslbreakdown = oslbreakdown;
    }
}
