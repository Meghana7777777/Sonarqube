import { PackageLists } from "./active-packages-model";
import { supplierScoreCard } from "./supplier-score.details";

export class SupplierDetails {
    supplierName: string;// 
    totalOrders: number; // Total No of packing Lists 
    ordersCompleted: number; // Total Packing Lists Recievied // GRN
    ordersPending: number; // total packing lists - total packng list recieved
    activePackages: PackageLists[];
    supplierScore: supplierScoreCard[];
    onTimeDeliveryRate?: number;
    avgDelayInDays: number;

    constructor(
        supplierName: string,
        totalOrders: number,
        ordersCompleted: number,
        ordersPending: number,
        activePackages: PackageLists[],
        supplierScore: supplierScoreCard[],
        avgDelayInDays: number,
        onTimeDeliveryRate?: number,
        
    )
        {
            this.supplierName= supplierName; 
            this.totalOrders= totalOrders; // Total No of packing Lists 
            this.ordersCompleted= ordersCompleted; // Total Packing Lists Recievied // GRN
            this.ordersPending= ordersPending; // total packing lists - total packng list recieved
            this.activePackages= activePackages;
            this.supplierScore= supplierScore;
            onTimeDeliveryRate=  onTimeDeliveryRate;
            this.avgDelayInDays= avgDelayInDays;

        }
}