import { GlobalResponseObject } from "../../../common";
import { StyleWiseStockSummaryDto } from "./sale-order.req";

export class SaleOrderResp extends GlobalResponseObject{
    data : StyleWiseStockSummaryDto[];
    /**
     * @params status
     * @params errorCode
     * @params internalMessage
     * @param data
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data: StyleWiseStockSummaryDto[]){
        super(status, errorCode, internalMessage)
        this.data = data;
    }
}