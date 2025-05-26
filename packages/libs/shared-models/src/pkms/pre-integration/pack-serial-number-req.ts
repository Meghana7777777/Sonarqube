import { CommonRequestAttrs } from "../../common";

export class PackSerialNumberReqDto extends CommonRequestAttrs {
    packSerial?: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, packSerial?: number) {
        super(username, unitCode, companyCode, userId)
        this.packSerial = packSerial
    }
}