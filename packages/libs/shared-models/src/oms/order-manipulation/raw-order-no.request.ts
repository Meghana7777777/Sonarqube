import { CommonRequestAttrs } from "../../common";

export class RawOrderNoRequest extends CommonRequestAttrs {
    salOrdNo: string; // mo Number
    orderId: number; // no need
    purOrdNo: string; // no need
    salOrdLineNo: string; // mo line number // optional
    orderLineId: number; // no need

    iNeedSoLines: boolean; // true
    iNeedSoLineRm: boolean; 
    iNeedSoLineOp: boolean; 
    iNeedSoLineSubLines: boolean; // true
    iNeedSoLineSubLineRm: boolean; 
    iNeedOriginalSoLines: boolean; // no need

     constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        salOrdNo: string,
        orderId: number,
        purOrdNo: string,
        salOrdLineNo: string,
        orderLineId: number,
        iNeedSoLines: boolean,
        iNeedSoLineRm: boolean,
        iNeedSoLineOp: boolean,
        iNeedSoLineSubLines: boolean,
        iNeedSoLineSubLineRm: boolean,
        iNeedOriginalSoLines?: boolean
    ) {
        super(username, unitCode, companyCode, userId);

        this.salOrdNo = salOrdNo;
        this.purOrdNo = purOrdNo;
        this.orderId = orderId;
        this.salOrdLineNo = salOrdLineNo;      
        this.orderLineId = orderLineId;
        this.iNeedSoLines = iNeedSoLines;
        this.orderId = orderId;
        this.iNeedSoLineRm = iNeedSoLineRm;
        this.iNeedSoLineOp = iNeedSoLineOp;
        this.orderId = orderId;
        this.iNeedSoLineSubLines = iNeedSoLineSubLines;
        this.iNeedSoLineSubLineRm = iNeedSoLineSubLineRm;
        this.iNeedOriginalSoLines = iNeedOriginalSoLines;
    }
}


