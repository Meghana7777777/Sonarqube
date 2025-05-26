import { ProcessTypeEnum } from "../enum";

export class ProcessTypeWiseSizeModel {
    moPslId: number;
    quantity: number;
    processingType: ProcessTypeEnum;
    processingSerial: number;
    constructor(moPslId: number, quantity: number,processingType: ProcessTypeEnum, processingSerial: number) {
        this.moPslId = moPslId;
        this.quantity = quantity;
        this.processingType = processingType;
        this.processingSerial = processingSerial;
    }
} 