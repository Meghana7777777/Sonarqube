export class SewSerialDepGroupReq {
    sewSerial: number;
    unitCode: string;
    companyCode: string;
    preJobGroup: number;

    /**
     * Constructor for SewSerialDepGroupReq
     * @param sewSerial - The sewing serial number
     * @param unitCode - The unit code
     * @param companyCode - The company code
     * @param preJobGroup - The previous job group number
     */
    constructor(sewSerial: number, unitCode: string, companyCode: string, preJobGroup: number) {
        this.sewSerial = sewSerial;
        this.unitCode = unitCode;
        this.companyCode = companyCode;
        this.preJobGroup = preJobGroup;
    }
}
