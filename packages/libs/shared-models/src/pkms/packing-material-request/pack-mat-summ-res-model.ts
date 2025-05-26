import { MaterialTypeEnum } from "../enum"

export class PackMatSummaryModel {
    packJobs: []
    itemId: number
    itemCode: string
    qty: number
    itemCategory: MaterialTypeEnum
    mapId: number;
    issuedQty: number;
    constructor(
        packJobs: [],
        itemId: number,
        itemCode: string,
        qty: number,
        itemCategory: MaterialTypeEnum,
        mapId: number,
        issuedQty: number
    ) {
        this.packJobs = packJobs
        this.itemId = itemId
        this.itemCode = itemCode
        this.qty = qty
        this.itemCategory = itemCategory
        this.mapId = mapId;
        this.issuedQty = issuedQty;
    }
}


export class PackJobsGroup {
    packJobNumber: number
    packNumber: string
}
