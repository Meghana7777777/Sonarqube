import { ContainerSubItemModel } from "./container-sub-item.model";

export class ContainerModel {
    id: number; // PK of the d_set_container
    barcode: string;
    containerNumber: string;
    totalSubItemsInContainer: number; // retrieve this only when detailed information is asked
    subItemsInContainer: ContainerSubItemModel[];
    constructor(
        id: number, 
        barcode: string,
        containerNumber: string,
        totalSubItemsInContainer: number, 
        subItemsInContainer: ContainerSubItemModel[]) {
        this.id = id
        this.barcode = barcode
        this.containerNumber = containerNumber
        this.totalSubItemsInContainer = totalSubItemsInContainer
        this.subItemsInContainer = subItemsInContainer

    }
}