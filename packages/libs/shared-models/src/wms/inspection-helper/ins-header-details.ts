import { GlobalResponseObject } from "../../common";

export class HeaderDetails  {
    percentage: number;

    constructor(percentage: number) {
        this.percentage = percentage;
    }
} 


export class HeaderDetailsResponse  extends GlobalResponseObject   {
    data: HeaderDetails;
    constructor(status: boolean, errorCode: number, internalMessage: string,data: HeaderDetails) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
} 
