import { CommonRequestAttrs } from "../../../common";

export class RollIdQtyRequest extends CommonRequestAttrs {
    rollId: number;
    quantity: number;
    consumedOn: string; // YYYY-MM-DD HH:MM the date on which the consumption is done. 
    constructor(username: string, unitCode: string, companyCode: string, userId: number, rollId: number, quantity: number, consumedOn: string) {
        super(username, unitCode, companyCode, userId)
        this.rollId = rollId;
        this.quantity = quantity;
        this.consumedOn = consumedOn;
    }
}
