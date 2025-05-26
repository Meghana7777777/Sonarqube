import { CommonRequestAttrs } from "../common";
import { ProcessTypeEnum } from "../oms";

export class KnitJobConsumptionRequest extends CommonRequestAttrs {
    jobNumber: string;
    productCode: string;
    processingSerial: number;
    fgColor: string;
    knitGroup: string;
    processType: ProcessTypeEnum;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        jobNumber: string,
        productCode: string,
        processingSerial: number,
        fgColor: string,
        knitGroup: string,
        processType: ProcessTypeEnum
    ) {
        super(username, unitCode, companyCode, userId)
        this.jobNumber = jobNumber
        this.productCode = productCode
        this.processingSerial = processingSerial
        this.fgColor = fgColor
        this.knitGroup = knitGroup
        this.processType = processType
    }
}