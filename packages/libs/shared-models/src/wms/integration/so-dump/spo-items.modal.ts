import { SpoItemCategoryEnum } from "../../enum";

export class SpoItemsModal {
    id: number;
    uniqueIdentifier: string;
    unitCode:string;
    companyCode: string;
    itemCode: string;
    itemName: string;
    itemDesc: string;
    quantity: string;
    uom: string;
    itemColor: string;
    itemSize: string;
    itemColorCode: string;
    itemSizeCode: string;
    vpoNumber: string;
    poNumber: string;
    poItemLine: string;
    saleOrderItemId: any;
    itemCategory: SpoItemCategoryEnum;
    itemType: string;
    itemWeight: string;
    packHeaderId: any;
    fabricMeters:string;
    userUnitCode:string;
    /**
     * 
     * @param uniqueIdentifier company+unit+spo_number+sale_order_item_code
     * @param itemCode 
     * @param itemName 
     * @param itemDesc 
     * @param quantity 
     * @param uom 
     * @param itemColor 
     * @param itemSize 
     * @param itemColorCode 
     * @param itemSizeCode 
     * @param vpoNumber 
     * @param poNumber 
     * @param poItemLine 
     * @param saleOrderItemId 
     * @param itemCategory 
     * @param itemType 
     * @param itemWeight 
     * @param packHeaderId 
     * @param fabricMeters
     * @param userUnitCode
     */
    constructor(
        uniqueIdentifier: string,
        itemCode: string,
        itemName: string,
        itemDesc: string,
        quantity: string,
        uom: string,
        itemColor: string,
        itemSize: string,
        itemColorCode: string,
        itemSizeCode: string,
        vpoNumber: string,
        poNumber: string,
        poItemLine: string,
        saleOrderItemId: any,
        itemCategory: SpoItemCategoryEnum,
        itemType: string,
        itemWeight: string,
        packHeaderId: any,
        fabricMeters: string,
        userUnitCode:string,
    ) {
        this.uniqueIdentifier = uniqueIdentifier;
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.itemDesc = itemDesc;
        this.quantity = quantity;
        this.uom = uom;
        this.itemColor = itemColor;
        this.itemSize = itemSize;
        this.itemColorCode = itemColorCode;
        this.itemSizeCode = itemSizeCode;
        this.vpoNumber = vpoNumber;
        this.poNumber = poNumber;
        this.poItemLine = poItemLine;
        this.saleOrderItemId = saleOrderItemId;
        this.itemCategory = itemCategory;
        this.itemType = itemType;
        this.itemWeight = itemWeight;
        this.packHeaderId = packHeaderId;
        this.fabricMeters = fabricMeters;
        this.userUnitCode = userUnitCode;
    }
}
