import { PkContainerTypeEnum } from "../enum";

export class PkDSetPlannedItemContainerModel {
    itemRefNo?: string;  // PK of the cps.po_cit
    containerType: PkContainerTypeEnum; // The container type possibly could be Bag/Scahet/Carton .. etc
    containerNos: string[]; // Possible container/polybags/sachets/wrappers where this current item will be put into
    remarks?: string;
    constructor(
        containerType: PkContainerTypeEnum,
        containerNos: string[],
        itemRefNo?: string,
        remarks?: string,
    ) {
        this.containerType = containerType
        this.containerNos = containerNos
        this.itemRefNo = itemRefNo
        this.remarks = remarks

    }
}


// {
//     "itemRefNo": "122",
//     "containerType": "BAG",
//     "containerNos": [1,2,3],
//     "remarks": "Cut1 Bags"
// }