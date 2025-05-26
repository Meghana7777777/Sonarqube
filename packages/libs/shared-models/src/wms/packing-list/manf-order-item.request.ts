import { CommonRequestAttrs } from "../../common";


export class ManufacturingOrderItemRequest extends CommonRequestAttrs {
    manufacturingOrderCode: string;
    itemCode: string[];
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        manufacturingOrderCode: string,
        itemCode: string[]
    ) {
        super(username, unitCode, companyCode, userId)
        this.manufacturingOrderCode = manufacturingOrderCode;
        this.itemCode = itemCode;
    }
}

// export class PhItemLinesIdRequest extends CommonRequestAttrs {
//     phItemLinesId: number;
//     constructor(
//         username: string,
//         unitCode: string,
//         companyCode: string,
//         userId: number,
//         phItemLinesId: number,
//     ) {
//         super(username, unitCode, companyCode, userId)
//         this.phItemLinesId = phItemLinesId;
//     }
// }