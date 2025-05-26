import { PkDSetSubItemsModel } from "../../../dispatch-set";

export class PkSrFinalItemsModel {
    dSetSubItems: PkDSetSubItemsModel[]; // list of all cartons
    loadedSubItems: string[]; // array of carton barcodes that are already loaded into the truck
    constructor(dSetSubItems: PkDSetSubItemsModel[], loadedSubItems: string[]){
        this.dSetSubItems = dSetSubItems
        this.loadedSubItems = loadedSubItems
    }
}

