
export class PlInfo {
    packingListCount: number;
    plIds: string;
    supplierName: string;
    poNumber : string;

    constructor(
        packingListCount: number,
        plIds: string,
        supplierName: string,
        poNumber : string

    ){
        this.packingListCount = packingListCount;
        this.plIds = plIds;
        this.supplierName = supplierName;
        this.poNumber = poNumber;
    }
}