
import { PoRmItemsModel } from "./po-rm-items.model";

export class PoRmModel {
    poSerial: number;
    orderNo: string;
    orderId: number;
    poDesc: string;
    poRmItems: PoRmItemsModel[];
    constructor(
        poSerial: number,
        orderNo: string,
        orderId: number,
        poDesc: string,
        poRmItems: PoRmItemsModel[],
    )
    {
        this.poSerial = poSerial;
        this.orderId = orderId;
        this.orderNo = orderNo;
        this.poDesc = poDesc;
        this.poRmItems = poRmItems;

    }
}