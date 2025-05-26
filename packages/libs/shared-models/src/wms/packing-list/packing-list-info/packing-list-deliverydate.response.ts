import { GlobalResponseObject } from "../../../common";
import { PackingListDeliveryDateModel } from "./packing-list-deliverydate.model";


export class PackingListDeliveryDateResp extends GlobalResponseObject {
    data?: PackingListDeliveryDateModel[];

    /**
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data: PackingListDeliveryDateModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}