export class ProductInfoResp {
    styles: string[];
    styleDesc: string[];
    customerStyle: string[];
    buyers: string[];
    colors: string[];
    suppliers: string[];
    itemDesc: string;
    itemCode: string;
    poNumber: string;
    millShade: string;
    packingListNumber: string;

    constructor(styles: string[],
        styleDesc: string[],
        customerStyle: string[],
        buyers: string[],
        colors: string[],
        suppliers: string[],
        itemDesc: string,
        itemCode: string,
        poNumber: string, millShade: string,
        packingListNumber: string,) {
            this.styles = styles;
            this.styleDesc = styleDesc;
            this.customerStyle = customerStyle;
            this.buyers = buyers;
            this.colors = colors;
            this.suppliers = suppliers;
            this.itemDesc = itemDesc;
            this.itemCode = itemCode;
            this.poNumber = poNumber;
            this.millShade = millShade;
            this.packingListNumber = packingListNumber;
    }
}