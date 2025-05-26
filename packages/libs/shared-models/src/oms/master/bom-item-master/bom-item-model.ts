export class ItemModel {
    id?: number;
    itemName: string;
    itemCode: string;
    itemDescription: string;
    itemSku: string;
    isActive?: boolean;
    rmItemType?: string;
    bomItemType?: string;
    itemColor?: string;

    constructor(
        id: number,
        itemName: string,
        itemCode: string,
        itemDescription: string,
        itemSku: string,
        isActive: boolean,
        rmItemType: string,
        bomItemType: string,
        itemColor: string
    ) {
        this.id = id;
        this.itemName = itemName;
        this.itemCode = itemCode;
        this.itemDescription = itemDescription;
        this.itemSku = itemSku;
        this.isActive = isActive;
        this.rmItemType = rmItemType;
        this.bomItemType = bomItemType;
        this.itemColor = itemColor;
    }
}