export class RawMaterialInfoModel {
    itemCode: string;
    itemName: string;
    itemDesc: string;
    sequence: number;
    consumption: number;
    wastage: number;
    itemType: string;
    itemSubType: string;
    itemColor: string;
    itemUom: string;

    constructor(
        itemCode: string,
        itemName: string,
        itemDesc: string,
        sequence: number,
        consumption: number,
        wastage: number,
        itemType: string,
        itemSubType: string,
        itemColor: string,
        itemUom: string
    ) {
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.itemDesc = itemDesc;
        this.sequence = sequence;
        this.consumption = consumption;
        this.wastage = wastage;
        this.itemType = itemType;
        this.itemSubType = itemSubType;
        this.itemColor = itemColor;
        this.itemUom = itemUom;
    }
}
