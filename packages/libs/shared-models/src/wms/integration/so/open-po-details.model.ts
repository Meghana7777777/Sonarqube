export class OpenPoDetailsModel {
    poNumber: string;
    poCreateDate: string;
    supplier: string;
    saleOrderNumber: string;
    businessUnit: string;
    profitCentreCode: string;
    profitCentreName: string;
    customerCode: string;
    customerName: string;
    garmentVendor: string;
    styleNumber: string;
    itemNo: string;
    itemName:string;
    description: string;
    color: string;
    uom: string;
    poQty: number;
    grnQty: number;
    pendingQty: number;
    /**
     * 
     * @param poNumber 
     * @param poCreateDate
     * @param supplier
     * @param saleOrderNumber
     * @param businessUnit
     * @param businessUnit
     * @param profitCentreCode
     * @param profitCentrename
     * @param customerCode
     * @param customerName
     * @param garmentVendor
     * @param styleNumber
     * @param itemNo
     * @Param itemName
     * @param description
     * @param color
     * @param uom
     * @param poQty
     * @param grnQty
     * @param pendingQty
     */
    constructor( poNumber: string,
        poCreateDate: string,
        supplier: string,
        saleOrderNumber: string,
        businessUnit: string,
        profitCentreCode: string,
        profitCentreName: string,
        customerCode: string,
        customerName: string,
        garmentVendor: string,
        styleNumber: string,
        itemNo: string,
        itemName:string,
        description: string,
        color: string,
        uom: string,
        poQty: number,
        grnQty: number,
        pendingQty: number,) {
        this.poNumber=poNumber;  
        this.poCreateDate = poCreateDate;
        this.supplier = supplier;
        this.saleOrderNumber = saleOrderNumber;
        this.businessUnit = businessUnit;
        this.profitCentreCode = profitCentreCode;
        this.profitCentreName = profitCentreName;
        this.garmentVendor = garmentVendor;
        this.styleNumber = styleNumber;
        this.customerCode = customerCode;
        this.customerName = customerName;
        this.itemNo = itemNo;
        this.itemName=itemName;
        this.description = description;
        this.color = color;
        this.uom = uom;
        this.poQty = poQty;
        this.grnQty = grnQty;
        this.pendingQty = pendingQty;

    }
}