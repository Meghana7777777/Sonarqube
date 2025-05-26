import { DSetPlannedItemContainerModel } from "./d-set-planned-item-container.model";

export class DSetItemNosModel {
    itemParentRefNo?: string; // PK of oes.p_order This is the parent entity ref no. Usually the cut order PK / PK of the pack order
    itemRefNos: string[]; // PK of the cps.po_cit / packlist ids
    plannedItemContainers: DSetPlannedItemContainerModel[];
    remarks?: string;
    constructor(
        itemRefNos: string[], 
        plannedItemContainers: DSetPlannedItemContainerModel[],
        itemParentRefNo?: string,
        remarks?: string,
    ) {
        this.itemParentRefNo = itemParentRefNo
        this.itemRefNos = itemRefNos
        this.plannedItemContainers = plannedItemContainers
        this.remarks = remarks
    }

}

// {
//     "itemRefNos": ["122", "123"],
//     "plannedItemContainers": [
//         {
//             "itemRefNo": "122",
//             "containerType": "BAG",
//             "containerNos": [1,2,3],
//             "remarks": "Cut 1 Bags"
//         },
//         {
//             "itemRefNo": "123",
//             "containerType": "BAG",
//             "containerNos": [1,2,3],
//             "remarks": "Cut 2 Bags"
//         }
//     ],
//     "remarks": "Manual cut"
// }