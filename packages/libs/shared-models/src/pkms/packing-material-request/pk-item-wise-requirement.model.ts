import { PhItemCategoryEnum } from "../../common";
import { PK_ObjectWiseAllocationInfo_R } from "./pk-object-wise-allocation-info";

export class PK_ItemWiseMaterialRequirementModel {
    itemCode: string;
    itemName: string;
    itemDescription: string;
    itemColor: string;
    itemType: PhItemCategoryEnum;
    totalRequiredQty: number;
    totalAllocatedQty: number;
    totalIssuedQty: number;
    objectWiseDetail: PK_ObjectWiseAllocationInfo_R[];
    constructor(
        itemCode: string,
        itemName: string,
        itemDescription: string,
        itemColor: string,
        itemType: PhItemCategoryEnum,
        totalRequiredQty: number,
        totalAllocatedQty: number,
        totalIssuedQty: number,
        objectWiseDetail: PK_ObjectWiseAllocationInfo_R[]
    ) {
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.itemColor = itemColor;
        this.itemType = itemType;
        this.totalRequiredQty = totalRequiredQty;
        this.totalAllocatedQty = totalAllocatedQty;
        this.totalIssuedQty = totalIssuedQty;
        this.objectWiseDetail = objectWiseDetail;
    }
}

export class PK_ItemWiseAllocationModel_C {
    itemCode: string;
    totalRequiredQty: number;
    objectWiseDetail: PK_ObjectWiseAllocationInfo_C[];

    /**
     * Constructor for PK_ItemWiseAllocationModel
     * @param itemCode - Code of the item
     * @param totalRequiredQty - Total required quantity of the item
     * @param objectWiseDetail - List of object-wise allocation details
     */
    constructor(
        itemCode: string,
        totalRequiredQty: number,
        objectWiseDetail: PK_ObjectWiseAllocationInfo_C[]
    ) {
        this.itemCode = itemCode;
        this.totalRequiredQty = totalRequiredQty;
        this.objectWiseDetail = objectWiseDetail;
    }
}

export class PK_ObjectWiseAllocationInfo_C {
    objectCode: string; // could be roll number / cone number etc.
    allocatingQuantity: number; // allocation quantity from that particular object; required only when creating

    /**
     * Constructor for PK_ObjectWiseAllocationInfo_C
     * @param objectCode - Code of the object (e.g., roll number, cone number)
     * @param allocatingQuantity - Quantity allocated from this object
     */
    constructor(objectCode: string, allocatingQuantity: number) {
        this.objectCode = objectCode;
        this.allocatingQuantity = allocatingQuantity;
    }
}