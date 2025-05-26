import { GlobalResponseObject } from "../../../common";
import { StyleWiseStockSummaryDto } from "../so";
// import { StyleWiseStockSummaryDto } from "./manf-order.req";

export class ManufacturingOrderResp extends GlobalResponseObject{
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