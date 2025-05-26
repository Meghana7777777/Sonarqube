import { CommonRequestAttrs } from "../../../common";

export class StockConsumptionModel {

    itemId: number;
    itemBarcode: string;
    jobRef: string; // the docket number
    jobActualRef: string; // the laying id
    consumedQty: number; // the consumed qty of the roll/any other thing
    consumedOn: string; // YYYY-MM-DD HH:MM the date on which the consumption is done. 
    refTransactionId: number; // The PK of the onfloor rolls

    constructor(
        itemId: number,
        itemBarcode: string,
        jobRef: string, // the docket number
        jobActualRef: string, // the laying id
        consumedQty: number,
        consumedOn: string,
        refTransactionId: number
    ) {
        this.itemId = itemId;
        this.itemBarcode = itemBarcode;
        this.jobRef = jobRef;
        this.jobActualRef = jobActualRef;
        this.consumedQty = consumedQty;
        this.consumedOn = consumedOn;
        this.refTransactionId = refTransactionId;

    }
}