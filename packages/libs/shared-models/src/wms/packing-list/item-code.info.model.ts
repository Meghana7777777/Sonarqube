export class ItemCodeInfoModel {
    materialItemCode: string;
    materialItemName: string;
    materialItemDesc: string;
    quantity: number;
    itemColor: string;
    itemSize: string;
    poNumber: string;
    poItemLine: string;
    uom: string;
    constructor(
        materialItemCode: string,
        materialItemName: string,
        materialItemDesc: string,
        quantity: number,
        itemColor: string,
        itemSize: string, poNumber: string,
        poItemLine: string, uom: string) {
        this.materialItemCode = materialItemCode;
        this.materialItemName = materialItemName;
        this.materialItemDesc = materialItemDesc;
        this.quantity = quantity;
        this.itemColor = itemColor;
        this.itemSize = itemSize;
        this.poNumber = poNumber;
        this.poItemLine = poItemLine;
        this.uom = uom;
    }
}