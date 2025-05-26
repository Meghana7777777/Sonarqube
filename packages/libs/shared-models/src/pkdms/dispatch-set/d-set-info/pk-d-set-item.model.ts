import { PkDSetItemAttrEnum } from "../../enum";
import { PkContainerModel } from "./pk-container.model";
import { PkDSetSubItemsModel } from "./pk-d-set-sub-item.model";



export class PkDSetItemModel {
    id: number; // PK of the d_set_item
    // moNo: string; // mo number
    packListNo: string;
    packListDesc: string;
    packListId: string;
    totalSubItems: number; // no of cartons in the PL
    totalFgQty: number;
    // containers: PkContainerModel[];  // bags
    itemsPrintStatus: boolean;
    shippingReqCreated: boolean;
    itemAttributes: {[key in PkDSetItemAttrEnum]?: string};
    dSetSubItems: PkDSetSubItemsModel[];

    constructor(
        id: number,
        // moNo: string,
        packListNo: string,
        packListId: string,
        packListDesc: string,
        totalSubItems: number,
        itemsPrintStatus: boolean,
        shippingReqCreated: boolean,
        totalFgQty: number,
        itemAttributes: {[key in PkDSetItemAttrEnum]?: string},
        dSetSubItems: PkDSetSubItemsModel[]
    ) {
        this.id = id;
        // this.moNo = moNo;
        this.packListNo = packListNo;
        this.packListId = packListId;
        this.packListDesc = packListDesc;
        this.totalSubItems = totalSubItems;
        this.itemsPrintStatus = itemsPrintStatus;
        this.shippingReqCreated = shippingReqCreated;
        this.itemAttributes = itemAttributes;
        this.dSetSubItems = dSetSubItems;
        this.totalFgQty = totalFgQty;
    }
}




const conversionToCentimeter = (items: PkDSetItemModel[]) => {

}