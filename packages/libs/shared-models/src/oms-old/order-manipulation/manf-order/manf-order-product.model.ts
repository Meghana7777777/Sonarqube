import { CommonRequestAttrs } from "../../../common";

export class ManufacturingOrderProductName extends CommonRequestAttrs {
    manufacturingOrderName: string;
    productName: string;
    productType: string;

    /**
     * Constructor for ManufacturingOrderProductName
     * @param username - The username associated with the request
     * @param unitCode - The unit code
     * @param companyCode - The company code
     * @param userId - The user ID
     * @param manufacturingOrderName - The name of the manufacturing order
     * @param productName - The name of the product
     * @param productType - The type/category of the product
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        manufacturingOrderName: string,
        productName: string,
        productType: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.manufacturingOrderName = manufacturingOrderName;
        this.productName = productName;
        this.productType = productType;
    }
}
