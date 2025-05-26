import { PackListCartoonIDs } from "../../dispatch-set";
import { PkShippingRequestItemLevelEnum } from "../../enum";
import { PkShippingReqesutItemAttrsModel } from "./pk-shipping-request-item-attrs.model";


export class PkShippingReqesutItemModel {
    id: number; // PK of the sr item id
    itemLevel: PkShippingRequestItemLevelEnum;
    refId: number; // PK based on the item level. For now it is D_SET_ID
    drReqNo: string;
    moNumber: string; // l4 of sr_item
    style: string; // l3 of sr_item
    packListIds: string[];
    packListCartoonIds: PackListCartoonIDs[];
    srItemAttrModel: PkShippingReqesutItemAttrsModel;
    fgOutReqCreated?: boolean
    constructor(
        id: number, // PK of the sr item id
        itemLevel: PkShippingRequestItemLevelEnum,
        refId: number, // PK based on the item level. For now it is D_SET_ID
        drReqNo: string, // dispatch request number 
        moNumber: string, // l4 of sr_item
        style: string, // l3 of sr_item
        packListIds: string[],
        packListCartoonIds: PackListCartoonIDs[],
        srItemAttrModel: PkShippingReqesutItemAttrsModel,
        fgOutReqCreated?: boolean
    ) {
        this.id = id;
        this.itemLevel = itemLevel;
        this.refId = refId;
        this.drReqNo = drReqNo;
        this.moNumber = moNumber;
        this.style = style;
        this.packListIds = packListIds;
        this.packListCartoonIds = packListCartoonIds
        this.srItemAttrModel = srItemAttrModel;
        this.fgOutReqCreated = fgOutReqCreated;
    }
}


