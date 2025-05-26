import { PkContainerSubItemModel } from "./pk-container-sub-item.model";

export class PkContainerModel {
    id: number; // PK of the d_set_container
    barcode: string;
    containerNumber: string;
    totalSubItemsInContainer: number; // retrieve this only when detailed information is asked
    subItemsInContainer: PkContainerSubItemModel[];
    constructor(
        id: number, 
        barcode: string,
        containerNumber: string,
        totalSubItemsInContainer: number, 
        subItemsInContainer: PkContainerSubItemModel[]) {
        this.id = id
        this.barcode = barcode
        this.containerNumber = containerNumber
        this.totalSubItemsInContainer = totalSubItemsInContainer
        this.subItemsInContainer = subItemsInContainer

    }
}