import { PhItemCategoryEnum } from "../../../common";
import { WhReqByObjectEnum } from "../enum/wh-req-by-object.enum";

export class WhReqCreateItemsListModel {
    inventoryId: number; // pk of the rolls table, trims table, etc..
    barcode: string; // barcode of the roll if fabric. packet if buttons. etc..
    reqQty: number;

    constructor(
        inventoryId: number, // pk of the rolls table, trims table, etc..
        barcode: string, // barcode of the roll if fabric. packet if buttons. etc..
        reqQty: number,
    ) {
        this.inventoryId = inventoryId;
        this.barcode = barcode;
        this.reqQty = reqQty;
    }
}

