
/**
 * subLine: string   ---- size
 * quantity: number  ---- original qty
 * plGenQty: number  ---- pack list generated qty
 */
export class PLSubLineQtyModel {
    subLineId: number;
    subLine: string;
    quantity: number;
    plGenQty: number;
    addQuantity: number;

    /**
     * @param subLineId : string   ---- pkId of size in pre-Integration
     * @param subLine : string   ---- size
     * @param quantity : number  ---- original qty
     * @param plGenQty number  ---- pack list generated qty
     */
    constructor(subLineId: number, subLine: string, quantity: number, plGenQty: number,addQuantity: number) {
        this.subLineId = subLineId;
        this.subLine = subLine;
        this.quantity = quantity;
        this.plGenQty = plGenQty;
        this.addQuantity = addQuantity;
    }
}