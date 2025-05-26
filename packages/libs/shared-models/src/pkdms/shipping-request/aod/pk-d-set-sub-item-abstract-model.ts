// DSETITEM Abstract
// The abstarct 
export class PkDSetSubItemAbstractModel {
    ctnBarcode: string;
    quantity: number;
    constructor(
        ctnBarcode: string,
        quantity: number
    ) {
        this.ctnBarcode = ctnBarcode
        this.quantity = quantity
    }
}