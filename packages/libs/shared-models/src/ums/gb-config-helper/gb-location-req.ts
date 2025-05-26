import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { GBLocationModel } from "./gb-location-model";

export class GBLocationRequest extends CommonRequestAttrs {
    secCode: string[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        secCode: string[]


    ) {
        super(username, unitCode, companyCode, userId);
        this.secCode = secCode;
    }


}