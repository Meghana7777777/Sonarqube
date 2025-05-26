import { ProcessTypeEnum } from "../oms";

export class SewSerialProcessTypeReq {
    sewSerial: number;
    processType: ProcessTypeEnum;
    unitCode: string;
    companyCode: string;

    /**
     * Constructor for SewSerialProcessTypeReq
     * @param sewSerial - The sewing serial number
     * @param processType - The process type (ProcessTypeEnum)
     * @param unitCode - The unit code
     * @param companyCode - The company code
     */
    constructor(sewSerial: number, processType: ProcessTypeEnum, unitCode: string, companyCode: string) {
        this.sewSerial = sewSerial;
        this.processType = processType;
        this.unitCode = unitCode;
        this.companyCode = companyCode;
    }
}
