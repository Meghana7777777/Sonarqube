import { GlobalResponseObject } from "../../common"
import { BuyerAnalysis } from "./buyer-model";

export class BuyerDashboardsResponse extends GlobalResponseObject{

    data?:BuyerAnalysis;
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: BuyerAnalysis) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}

