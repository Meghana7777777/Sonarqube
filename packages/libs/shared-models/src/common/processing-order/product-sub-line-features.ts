export class ProductSubLineFeatures {
    productSubLineId: number;
    planProcessingDate: string;
    planDeliveryDate: string;
    destination: string;
    coNumber: string;

    /**
     * Constructor for ProductSubLineFeatures
     * @param productSubLineId - The ID of the product sub-line
     * @param planProcessingDate - The planned processing date
     * @param planDeliveryDate - The planned delivery date
     * @param destination - The destination
     * @param coNumber - The customer order number
     */
    constructor(productSubLineId: number, planProcessingDate: string, planDeliveryDate: string, destination: string, coNumber: string) {
        this.productSubLineId = productSubLineId;
        this.planProcessingDate = planProcessingDate;
        this.planDeliveryDate = planDeliveryDate;
        this.destination = destination;
        this.coNumber = coNumber;
    }
}
