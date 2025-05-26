import { CommonRequestAttrs } from "packages/libs/shared-models/src/common";

export class FgColorSizeCompRequest extends CommonRequestAttrs {
    fgNumbers: number[]; // Array of finished goods numbers

    color: string; // Color of the product
    productName: string; // Name of the product
    size: string; // Size of the product
    components: string[]; // Array of components related to the product
    reportedBundlesOnly: boolean; // boolean for if wants only reported response
    isBundleWiseInfoNeed : boolean;
    minEligibleQty: number; // It will be updated by query as response. in request it would be 0

    constructor(
        username: string,
        userId: number,
        unitCode: string,
        companyCode: string,
        fgNumbers: number[],
        color: string,
        productName: string,
        size: string,
        components: string[],
        reportedBundlesOnly: boolean,
        isBundleWiseInfoNeed : boolean,
        minEligibleQty: number
    ) {
        super(username, unitCode, companyCode, userId); // Initialize parent class attributes
        this.fgNumbers = fgNumbers; // Initialize finished goods numbers
        this.unitCode = unitCode; // Initialize unit code
        this.companyCode = companyCode; // Initialize company code
        this.color = color; // Initialize color
        this.productName = productName; // Initialize product name
        this.size = size; // Initialize size
        this.components = components; // Initialize components
        this.reportedBundlesOnly = reportedBundlesOnly;
        this.isBundleWiseInfoNeed = isBundleWiseInfoNeed;
        this.minEligibleQty = minEligibleQty;
    }
}
