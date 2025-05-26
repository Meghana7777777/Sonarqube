export class SaleOrderModal {
    id: number;
    saleOrderCode: string;
    unitCode:string;
    uniqueIdentifier: string;
    saleOrderDesc: string;
    customerCode: string;
    customerName: string;
    companyCode: string;
    companyName: string;
    style: string;
    styleCode: string;
    styleDesc: string;
    productName: string;
    buyerName: string;
    remarks: string;
    userUnitCode:string;
    /**
     * 
     * @param saleOrderCode 
     * @param uniqueIdentifier company+unit+sale_order_code
     * @param saleOrderDesc 
     * @param customerCode 
     * @param customerName 
     * @param companyCode 
     * @param companyName 
     * @param style 
     * @param styleCode 
     * @param styleDesc 
     * @param productName 
     * @param buyerName 
     * @param remarks 
     * @param userUnitCode
     */
    constructor(
        saleOrderCode: string,
        uniqueIdentifier: string,
        saleOrderDesc: string,
        customerCode: string,
        customerName: string,
        companyCode: string,
        companyName: string,
        style: string,
        styleCode: string,
        styleDesc: string,
        productName: string,
        buyerName: string,
        remarks: string,
        userUnitCode:string,
    ) {
        this.saleOrderCode = saleOrderCode;
        this.uniqueIdentifier = uniqueIdentifier;
        this.saleOrderDesc = saleOrderDesc;
        this.customerCode = customerCode;
        this.customerName = customerName;
        this.companyCode = companyCode;
        this.companyName = companyName;
        this.style = style;
        this.styleCode = styleCode;
        this.styleDesc = styleDesc;
        this.productName = productName;
        this.buyerName = buyerName;
        this.remarks = remarks;
        this.userUnitCode = userUnitCode;
    }
}
