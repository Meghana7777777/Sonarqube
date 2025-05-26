import { CommonRequestAttrs } from "../../common";

export class CartonBarCodesReqDto extends CommonRequestAttrs {
    cartonBarCodes: string[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, cartonBarCodes: string[]) {
        super(username, unitCode, companyCode, userId);
        this.cartonBarCodes = cartonBarCodes;
    }
}