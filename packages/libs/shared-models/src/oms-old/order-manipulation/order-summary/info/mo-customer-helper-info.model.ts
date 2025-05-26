
export class MoCustomerInfoHelperModel {
    coNo: string;
    productName: string;
    fgColor: string;
    exFactory: string; // YYYY-MM-DD
    customerCode: string;
    customerName: string;
    styleCode: string;
    styleDesc: string;
    moNo: string;
    moLine: string;
    buyerPoNumber: string; 
    gmtVendorName: string; // the cut panels purchasing vendor name from NL
    gmtVendorPo: string; // the PO number of the order created by the vendor to NL 
    gmtVendorUnitName: string; // The unit name to which the cut panels has to be sent
    quantity: number;
    cutOrderDesc: string; // To be add
    productType: string; // To be add
    plantStyle:string;

    constructor(
        coNo: string, // The 
        productName: string,
        fgColor: string,
        exFactory: string, // YYYY-MM-DD
        customerCode: string,
        customerName: string,
        styleCode: string,
        styleDesc: string,
        moNo: string,
        moLine: string,
        buyerPoNumber: string, 
        gmtVendorName: string, // the cut panels purchasing vendor name from NL
        gmtVendorPo: string, // the PO number of the order created by the vendor to NL 
        gmtVendorUnitName: string, // The unit name to which the cut panels has to be sent
        quantity: number,
        cutOrderDesc: string,
        productType: string,
        plantStyle?:string,
    ) {
        this.coNo = coNo;
        this.productName = productName;
        this.fgColor = fgColor;
        this.exFactory = exFactory;
        this.customerCode = customerCode;
        this.customerName = customerName;
        this.styleCode = styleCode;
        this.styleDesc = styleDesc;
        this.moNo = moNo;
        this.moLine = moLine;
        this.buyerPoNumber = buyerPoNumber;
        this.gmtVendorName = gmtVendorName;
        this.gmtVendorPo = gmtVendorPo;
        this.gmtVendorUnitName = gmtVendorUnitName;
        this.quantity = quantity;
        this.cutOrderDesc = cutOrderDesc;
        this.productType = productType;
        this. plantStyle = plantStyle;
    }
}
