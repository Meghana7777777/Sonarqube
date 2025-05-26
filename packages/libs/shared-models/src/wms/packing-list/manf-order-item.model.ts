export class ManufacturingOrderItemDataModel {
    manufacturingOrderCode: string;
    itemCode: string;
    itemName: string;
    itemDesc: string;
    itemPoQty: string;
    itemPackQty: string;
    itemGrnQty: string;
    itemAllocQty: string;
    itemIssueQty: string;
    constructor(manufacturingOrderCode: string, itemCode: string, itemName: string, itemDesc: string, itemPoQty: string, itemPackQty: string,itemGrnQty: string, itemAllocQty: string, itemIssueQty: string) {
        this.manufacturingOrderCode = manufacturingOrderCode;
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.itemDesc = itemDesc;
        this.itemPoQty = itemPoQty;
        this.itemPackQty = itemPackQty;
        this.itemGrnQty = itemGrnQty;
        this.itemAllocQty = itemAllocQty;
        this.itemIssueQty = itemIssueQty;
    }
}