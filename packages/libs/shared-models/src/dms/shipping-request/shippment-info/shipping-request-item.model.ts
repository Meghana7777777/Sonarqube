import { ShippingRequestItemLevelEnum } from "../../enum";
import { ShippingReqesutItemAttrsModel } from "./shipping-request-item-attrs.model";


export class ShippingReqesutItemModel {
    id: number; // PK of the sr item id
    itemLevel: ShippingRequestItemLevelEnum;
    refId: number; // PK based on the item level. For now it is D_SET_ID
    moNumber: string; // l4 of sr_item
    prodName: string; // l3 of sr_item
    srItemAttrModel: ShippingReqesutItemAttrsModel;

    constructor(
        id: number, // PK of the sr item id
        itemLevel: ShippingRequestItemLevelEnum,
        refId: number, // PK based on the item level. For now it is D_SET_ID
        moNumber: string, // l4 of sr_item
        prodName: string, // l3 of sr_item
        srItemAttrModel: ShippingReqesutItemAttrsModel
    ) {
        this.id = id;
        this.itemLevel = itemLevel;
        this.refId = refId;
        this.moNumber = moNumber;
        this.prodName = prodName;
        this.srItemAttrModel = srItemAttrModel;
    }
}


