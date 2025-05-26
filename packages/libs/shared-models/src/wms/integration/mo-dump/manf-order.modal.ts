export class ManufacturingOrderModal {
    id: number;
    manufacturingOrderCode: string;
    unitCode:string;
    uniqueIdentifier: string;
    manufacturingOrderDesc: string;
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
    /**
     * 
     * @param manufacturingOrderCode 
     * @param uniqueIdentifier company+unit+manufacturing_order_code
     * @param manufacturingOrderDesc 
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
     */
    constructor(
        manufacturingOrderCode: string,
        uniqueIdentifier: string,
        manufacturingOrderDesc: string,
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
    ) {
        this.manufacturingOrderCode = manufacturingOrderCode;
        this.uniqueIdentifier = uniqueIdentifier;
        this.manufacturingOrderDesc = manufacturingOrderDesc;
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
    }
}
