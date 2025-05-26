import { CommonRequestAttrs } from "../../common";
import { PackOrderCreationOptionsEnum } from "../enum/pack-order-creation-options.enum";


export class PackOrderCreationRequest extends CommonRequestAttrs {
    orderId: number;
    orderLine?: string;
    cutSerial?: string;
    options?: PackOrderCreationOptionsEnum[];

    constructor(username: string, unitCode: string, companyCode: string, userId: number, orderId: number, orderLine?: string, cutSerial?: string, options?: PackOrderCreationOptionsEnum[]) {
        super(username, unitCode, companyCode, userId);
        this.options = options;
        this.orderId = orderId;
        this.cutSerial = cutSerial;
        this.orderLine = orderLine;

    }
}