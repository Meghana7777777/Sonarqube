import { ProcessTypeEnum } from "../../oms";
import { CommonRequestAttrs } from "../common-request-attr.model";

export class ProcessingOrderSerialRequest extends CommonRequestAttrs {
    processingSerial: number[]
    processType: ProcessTypeEnum;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        processingSerial: number[],
        processType: ProcessTypeEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.processingSerial = processingSerial
        this.processType = processType
    }
}