
export class OrderAndOrderListModel {
    orderNo: string; 
    orderLineNo: string;
    plantStyle: string;
    styleDescription: string;
    styleCode: string;
    styleName: string;
    garmentVendorCode: string;    
    garmentVendorName: string;    
    garmentVendorPoItem: string;
    garmentVendorPo: string;    
    buyerLoc: string;    
    customerName: string;    
    customerCode: string;    
    profitCenterCode: string;    
    profitCenterName: string;    
    productName: string;    
    productCategory: string;

    constructor(
        orderNo: string,
        orderLineNo: string,
        plantStyle: string,
        styleDescription: string,
        styleCode: string,
        styleName: string,
        garmentVendorCode: string,
        garmentVendorName: string,
        garmentVendorPoItem: string,
        garmentVendorPo: string,
        buyerLoc: string,
        customerName: string,
        customerCode: string,
        profitCenterCode: string,
        profitCenterName: string,
        productName: string,
        productCategory: string
    ) {
        this.orderNo = orderNo;
        this.orderLineNo = orderLineNo;
        this.plantStyle = plantStyle;
        this.styleDescription = styleDescription;
        this.styleCode = styleCode;
        this.styleName = styleName;
        this.garmentVendorCode = garmentVendorCode;    
        this.garmentVendorName = garmentVendorName;    
        this.garmentVendorPoItem = garmentVendorPoItem;
        this.garmentVendorPo = garmentVendorPo;    
        this.buyerLoc = buyerLoc;    
        this.customerName = customerName;    
        this.customerCode = customerCode;    
        this.profitCenterCode = profitCenterCode;    
        this.profitCenterName = profitCenterName;    
        this.productName = productName;    
        this.productCategory = productCategory;
    }
}