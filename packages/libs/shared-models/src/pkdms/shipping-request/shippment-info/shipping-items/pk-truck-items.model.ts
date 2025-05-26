import { PkDSetSubItemsModel } from "../../../dispatch-set";

export class PkTruckItemsModel {
    truckId: number; // pk of the sr truck info
    truckNo: string;
    driverName: string;
    contact: string;
    itemsCount: number; // No of items put into this truck 
    items: PkDSetSubItemsModel[];
    constructor(truckId: number, truckNo: string, driverName: string, contact: string, itemsCount: number, items: PkDSetSubItemsModel[]){
        this.truckId = truckId;
        this.truckNo = truckNo;
        this.driverName = driverName;
        this.contact = contact;
        this.itemsCount = itemsCount;
        this.items = items;
    }
}
