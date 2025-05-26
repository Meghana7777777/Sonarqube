import { CommonRequestAttrs } from "../../common";

export class SewSerialIdRequest extends CommonRequestAttrs{
    sewSerialCode: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, sewSerialCode: string) {
        super(username, unitCode, companyCode, userId);
        this.sewSerialCode = sewSerialCode;
    }
}