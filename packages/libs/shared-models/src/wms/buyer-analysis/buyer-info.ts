
export class BuyerInfo {
    customerName: string;
    buyerPo: string;
    gmtPo: string;//purchaseOrderId:string;
    poNos : string;
    supplierName: string;//actiive inactive

    constructor(
        customerName: string,
        buyerPo: string,
        gmtPo: string,
        poNos:string,
        supplierName: string

    ){
        this.customerName = customerName;
        this.buyerPo = buyerPo;
        this.gmtPo = gmtPo;
        this.poNos = poNos;
        this.supplierName = supplierName;
    }
}