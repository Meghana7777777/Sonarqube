export class ProductInfoModel {
    productCode: string;
    productType: string;
    productName: string;

    /**
     * Constructor for ProductInfoModel
     * @param productCode - Unique product code
     * @param productType - Type of the product
     * @param productName - Name of the product
     */
    constructor(productCode: string, productType: string, productName: string) {
        this.productCode = productCode;
        this.productType = productType;
        this.productName = productName;
    }
}
