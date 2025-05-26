import { CommonRequestAttrs } from "../common";

export class SewSerialFgNumberReq extends CommonRequestAttrs {
    sewSerial: number;
    fgNumbers: number[];

    /**
     * Constructor for SewSerialFgNumberReq
     * @param username - The username
     * @param unitCode - The unit code
     * @param companyCode - The company code
     * @param userId - The user ID
     * @param date - The optional date
     * @param sewSerial - The sewing serial number
     * @param fgNumbers - Array of FG (Finished Goods) numbers
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        sewSerial: number,
        fgNumbers: number[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.sewSerial = sewSerial;
        this.fgNumbers = fgNumbers;
    }
}
