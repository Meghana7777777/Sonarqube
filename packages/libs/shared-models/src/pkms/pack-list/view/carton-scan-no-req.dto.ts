import { CommonRequestAttrs } from "../../../common";

export class CartonScanReqNoDto extends CommonRequestAttrs {
    cartonBarcode: string;
    isExternal: boolean = false;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        cartonBarcode: string,
        isExternal: boolean
    ) {
        super(username, unitCode, companyCode, userId)
        this.cartonBarcode = cartonBarcode;
        this.isExternal = isExternal;
    }
}