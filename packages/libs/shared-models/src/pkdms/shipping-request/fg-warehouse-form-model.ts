

export class WarehouseGroup {
    warehouseCode: string;
    floor: string;
    packingLists: PackingListData[];

    constructor(
        warehouseCode: string,
        floor: string,
        packingLists: PackingListData[]
    ) {
        this.warehouseCode = warehouseCode;
        this.floor = floor;
        this.packingLists = packingLists
    }
}

export class PackingListData {
    packListId: number;
    packListNo: string;
    packListCode: string;
    quantity: number;
    noOfCartons: number;
    cartonIds: number[];
    constructor(
        packListId: number,
        packListNo: string,
        packListCode: string,
        quantity: number,
        noOfCartons: number,
        cartonIds?: number[]
    ) {
        this.packListId = packListId;
        this.packListNo = packListNo;
        this.packListCode = packListCode;
        this.quantity = quantity;
        this.noOfCartons = noOfCartons;
        this.cartonIds = cartonIds;
    }
}