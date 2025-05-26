import { CommonRequestAttrs } from "../../../common";

export class ScanToPackRequest extends CommonRequestAttrs {
    cartonId: number;
    barcode: string;
    sizeId: number;
    leastChildId:number;
    constructor(
        username: string,
        userId: number,
        unitCode: string,
        companyCode: string,
        cartonId: number,
        barcode: string,
        sizeId: number,
        leastChildId:number
    ) {
        super(username, unitCode, companyCode, userId);
        this.cartonId = cartonId;
        this.barcode = barcode;
        this.sizeId = sizeId;
        this.leastChildId = leastChildId
    }
}
