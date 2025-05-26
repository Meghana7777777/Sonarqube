import { DSetItemAttrEnum } from "../../enum";
import { ContainerModel } from "./container.model";
import { DSetSubItemsModel } from "./d-set-sub-item.model";

export class DSetItemModel {
    id: number; // PK of the d_set_item
    cutNo: string;
    cutSubNo: string;
    refDoc: string;
    totalSubItems: number;
    containers: ContainerModel[];  // bags
    containerPrintStatus: boolean;
    itemsPrintStatus: boolean;
    shippingReqCreated: boolean;
    itemAttributes: {[key in DSetItemAttrEnum]?: string};
    dSetSubItems: DSetSubItemsModel[];

    constructor(
        id: number, 
        cutNo: string,
        cutSubNo: string,
        refDoc: string,
        totalSubItems: number,
        containers: ContainerModel[],
        containerPrintStatus: boolean,
        itemsPrintStatus: boolean,
        shippingReqCreated: boolean,
        itemAttributes: {[key in DSetItemAttrEnum]?: string},
        dSetSubItems: DSetSubItemsModel[]
    ) {
        this.id = id;
        this.cutNo = cutNo;
        this.cutSubNo = cutSubNo;
        this.refDoc = refDoc;
        this.totalSubItems = totalSubItems;
        this.containers = containers;
        this.containerPrintStatus = containerPrintStatus;
        this.itemsPrintStatus = itemsPrintStatus;
        this.shippingReqCreated = shippingReqCreated;
        this.itemAttributes = itemAttributes;
        this.dSetSubItems = dSetSubItems;
    }
}