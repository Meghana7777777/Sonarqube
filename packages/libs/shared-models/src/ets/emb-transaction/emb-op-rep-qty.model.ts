
export class EmbOpRepQtyModel {
    opCode: string;
    order: number;
    rQty: number;
    gQty: number;
    elgQty: number; // not retrieved

    constructor(
        opCode: string,
        order: number,
        rQty: number,
        gQty: number,
        elgQty: number
    ) {
        this.opCode = opCode;
        this.order = order;
        this.rQty = rQty;
        this.gQty = gQty;
        this.elgQty = elgQty;
    }
}