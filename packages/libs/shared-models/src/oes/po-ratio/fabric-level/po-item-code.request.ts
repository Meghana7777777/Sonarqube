import { CommonRequestAttrs } from "../../../common";

export class PoItemCodeRequest extends CommonRequestAttrs {
    poSerial: number;
    iCode: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        iCode: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.poSerial = poSerial;
        this.iCode = iCode;
    }
}