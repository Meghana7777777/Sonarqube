import { BuyerDetails } from "./buyer-details";

export class BuyerAnalysis {
    buyers: BuyerDetails[];
    overallBuyers : number;
    activeProductionOrders: number;//purchaseOrderId:string;
    overallProductionOrders: number;//actiive inactive
    unservedBuyers: string[]

    constructor(
        buyers: BuyerDetails[],
        overallBuyers: number,
        activeProductionOrders: number,
        overallProductionOrders: number,
        unservedBuyers: string[]
    ){
        this.buyers = buyers;
        this.overallBuyers = overallBuyers;
        this.activeProductionOrders = activeProductionOrders;
        this.overallProductionOrders = overallProductionOrders;
        this.unservedBuyers = unservedBuyers;
    }
}