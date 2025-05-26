import { CommonRequestAttrs } from "../../common";
import { TransactionLockStatusEnum } from "../../sps";

export class TransactionIdStatusReq extends CommonRequestAttrs {
    transactionId: number; // Unique ID for the transaction
    status: TransactionLockStatusEnum

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        transactionId: number,
        status: TransactionLockStatusEnum
    ) {
        super(username, unitCode, companyCode, userId); // Call the parent class constructor
        this.transactionId = transactionId;
        this.status = status;
    }
}