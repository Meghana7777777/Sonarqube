
export class RawOrderPackMethodModel {
    productName: string;
    productType: string;
    iCodes: string[];
    orderId: number;

    constructor(productName: string,
        productType: string,
        iCodes: string[],
        orderId: number) {
            this.productName = productName;
            this.productType = productType;
            this.iCodes = iCodes;
            this.orderId = orderId;
    }
}