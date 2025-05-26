import { CommonRequestAttrs } from "../../common";
import { TransactionLockStatusEnum } from "../../sps";

export class TransactionIdFgNumbersReq extends CommonRequestAttrs {
    transactionId: number; // Unique ID for the transaction
    fgNumbers: number[]; // Array of finished goods numbers
    cutSerial: number; // Serial number of the cut
    status: TransactionLockStatusEnum

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        transactionId: number,
        fgNumbers: number[],
        cutSerial: number,
        status: TransactionLockStatusEnum
    ) {
        super(username, unitCode, companyCode, userId); // Call the parent class constructor
        this.transactionId = transactionId;
        this.fgNumbers = fgNumbers;
        this.cutSerial = cutSerial;
        this.status = status;
    }
}