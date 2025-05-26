export class PackingListModel {
    packListId: number;
    packListNumber: string;
    poNumber: string;
    packListQty: number;
    noOfPackJobs: number;
    constructor(
        packListId: number,
        packListNumber: string,
        poNumber: string,
        packListQty: number,
        noOfPackJobs: number
    ) {
        this.packListId = packListId;
        this.packListNumber = packListNumber;
        this.poNumber = poNumber;
        this.packListQty = packListQty;
        this.noOfPackJobs = noOfPackJobs;
    }
}