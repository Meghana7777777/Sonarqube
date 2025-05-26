import { PkContainerModel } from "./pk-container.model";
import { PkDSetSubItemsModel } from "./pk-d-set-sub-item.model";

export class PkDSetItemsDetailedModel {
    id: number; // PK of the d_set_item
    cutNo: string;
    moNumber: string;
    cutOrderDesc: string;
    productName: string;
    totalSubItems: number;
    totalContainerPutSubItems: number;
    containers: PkContainerModel[];
    containerPrintStatus: boolean;
    subItemsPrintStatus: boolean;
    dSetSubItems: PkDSetSubItemsModel[];
    constructor(
        id: number, 
        cutNo: string,
        moNumber: string,
        cutOrderDesc: string,
        productName: string,
        totalSubItems: number,
        totalContainerPutSubItems: number,
        containers: PkContainerModel[],
        containerPrintStatus: boolean,
        subItemsPrintStatus: boolean,
        dSetSubItems: PkDSetSubItemsModel[]
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