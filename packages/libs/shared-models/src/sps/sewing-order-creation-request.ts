import { CommonRequestAttrs } from "../common";
import { SewingCreationOptionsEnum } from "./enum/sewing-creation-options.enum";

export class SewingOrderCreationRequest extends CommonRequestAttrs{
    orderId : number;
    orderLine?: string;
    cutSerial? : string;
    options? : SewingCreationOptionsEnum[];
    
    constructor(username: string,unitCode: string,companyCode: string,userId: number,orderId : number, orderLine?: string,cutSerial? : string,options? : SewingCreationOptionsEnum[]){
        super(username, unitCode, companyCode, userId);
        this.options = options;
        this.orderId = orderId;
        this.cutSerial = cutSerial;
        this.orderLine = orderLine;

    }
}