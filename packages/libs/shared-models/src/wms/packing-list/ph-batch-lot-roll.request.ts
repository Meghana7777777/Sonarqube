import { CommonRequestAttrs, PhItemCategoryEnum } from "../../common";


export class PhBatchLotRollRequest extends CommonRequestAttrs {
    phId: number;
    batchNumber: string;
    lotNumber: string;
    rollNumber: string;
    supplierCode: string; // TODO , Which is mandatory
    itemCategory: PhItemCategoryEnum

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        phId: number,
        batchNumber: string,
        lotNumber: string,
        rollNumber: string,
        supplierCode: string,
        itemCategory: PhItemCategoryEnum
    ) {
        super(username, unitCode, companyCode, userId)
        this.phId = phId;
        this.batchNumber = batchNumber;
        this.lotNumber = lotNumber;
        this.rollNumber = rollNumber;
        this.supplierCode = supplierCode;
        this.itemCategory = itemCategory;
    }
}