import { ProcessTypeEnum } from "../../oms";

// Model for 
export class MoPslQtyInfoModel {
    moPslId: number; 
    quantity: number;
    processingType: ProcessTypeEnum;
    processingSerial: number;

    /**
     * 
     * @param moPslId // MO Product sub line id
     * @param quantity // PO Qty for that moPslId
     * @param processingType // Process type
     * @param processingSerial // Processing Order serial number
     */
    constructor(moPslId: number, quantity: number,processingType: ProcessTypeEnum, processingSerial: number) {
        this.moPslId = moPslId;
        this.quantity = quantity;
        this.processingType = processingType;
        this.processingSerial = processingSerial;
    }
} 