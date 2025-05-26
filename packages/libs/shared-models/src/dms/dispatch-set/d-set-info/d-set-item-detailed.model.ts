import { ContainerModel } from "./container.model";
import { DSetSubItemsModel } from "./d-set-sub-item.model";

export class DSetItemsDetailedModel {
    id: number; // PK of the d_set_item
    cutNo: string;
    moNumber: string;
    cutOrderDesc: string;
    productName: string;
    totalSubItems: number;
    totalContainerPutSubItems: number;
    containers: ContainerModel[];
    containerPrintStatus: boolean;
    subItemsPrintStatus: boolean;
    dSetSubItems: DSetSubItemsModel[];
    constructor(
        id: number, 
        cutNo: string,
        moNumber: string,
        cutOrderDesc: string,
        productName: string,
        totalSubItems: number,
        totalContainerPutSubItems: number,
        containers: ContainerModel[],
        containerPrintStatus: boolean,
        subItemsPrintStatus: boolean,
        dSetSubItems: DSetSubItemsModel[]
    ) {
        this.id = id
        this.cutNo = cutNo
        this.moNumber = moNumber
        this.cutOrderDesc = cutOrderDesc
        this.productName = productName
        this.totalSubItems = totalSubItems
        this.totalContainerPutSubItems = totalContainerPutSubItems
        this.containers = containers
        this.containerPrintStatus = containerPrintStatus
        this.subItemsPrintStatus = subItemsPrintStatus
        this.dSetSubItems = dSetSubItems
    }
}