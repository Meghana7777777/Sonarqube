import { CommonRequestAttrs } from "@xpparel/shared-models";
import { PkDSetItemNosModel } from "./pk-d-set-item-nos.model";

export class PkDSetCreateRequest extends CommonRequestAttrs {
    // ATM this array size will be 1 for NL
    parentId?: string; // PK of the MO. Not required at the moment
    setItems: PkDSetItemNosModel[]; // This is the array of parent and child ref nos. To identify the childs under a parent. Since multiple parent related entities can be grouped into a single dispatchable set
    remarks: string;

    constructor(
        setItems: PkDSetItemNosModel[],
        remarks: string,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.setItems = setItems
        this.remarks = remarks
        this.username = username
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.userId = userId
    }
}


// {
//     "setItems": [
//         {
//             "itemRefNos": ["122", "123"],
//             "plannedItemContainers": [
//                 {
//                     "itemRefNo": "122",
//                     "containerType": "BAG",
//                     "containerNos": [1,2,3],
//                     "remarks": "Cut 1 Bags"
//                 },
//                 {
//                     "itemRefNo": "123",
//                     "containerType": "BAG",
//                     "containerNos": [1,2,3],
//                     "remarks": "Cut 2 Bags"
//                 }
//             ],
//             "remarks": "Manual cut"
//         }
//     ],
//     "remarks": "Hello"
// }









