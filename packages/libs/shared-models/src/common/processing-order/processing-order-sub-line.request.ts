export class ProcessingOrderSubLineRequest {
    moProductSubLineId: number;
    quantity: number;

    /**
     * Constructor for PoSubLineRequest
     * @param moProductSubLineId - Manufacturing Order Product Sub Line ID
     * @param quantity - Quantity requested
     */
    constructor(moProductSubLineId: number, quantity: number) {
        this.moProductSubLineId = moProductSubLineId;
        this.quantity = quantity;
    }
}
