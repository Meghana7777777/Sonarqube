import { StatusInfo } from "./buyer-status-info";

export  class BuyerDetails {
    buyerName: string;
    supplierName: string;
    purchaseOrderId:string;
    packingListCount: number;
    packingListStatusInformation: StatusInfo[];
    cutOrderCount:number;
    cutOrderStatusInformation:StatusInfo[];

    constructor(
        buyerName: string,
        supplierName: string,
        purchaseOrderId:string,
        packingListCount: number,
        packingListStatusInformation: StatusInfo[],
        cutOrderCount:number,
        cutOrderStatusInformation:StatusInfo[]
    ){
        this.buyerName= buyerName;
        this.supplierName= supplierName;
        this.purchaseOrderId= purchaseOrderId;
        this.packingListCount= packingListCount;
        this.packingListStatusInformation= packingListStatusInformation;
        this.cutOrderCount= cutOrderCount;
        this.cutOrderStatusInformation= cutOrderStatusInformation;
    }

}