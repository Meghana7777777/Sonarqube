export class ShippingReqesutItemAttrsModel {
    cutNumbers: string[]; // array of cut numbers
    cutSubNumbers: string[]; // array of cut sub numbers
    totalBagNos: string[]; // total bag numbers
    totalBagBarcodes: string[]; // barcodes
    totalSubItems: number; // total bundles in current case
    totalQty: number; // total qty planned i.e panels count
    putInBagSubItems: number;

    constructor(
        cutNumbers: string[], // array of cut numbers
        cutSubNumbers: string[], // array of cut sub numbers
        totalBagNos: string[], // total bag numbers
        totalBagBarcodes: string[], // barcodes
        totalSubItems: number, // total bundles in current case
        totalQty: number,
        putInBagSubItems: number
    ) {
        this.cutNumbers = cutNumbers;
        this.cutSubNumbers = cutSubNumbers;
        this.totalBagNos = totalBagNos;
        this.totalBagBarcodes = totalBagBarcodes;
        this.totalSubItems = totalSubItems;
        this.totalQty = totalQty;
        this.putInBagSubItems = putInBagSubItems;
    }
}