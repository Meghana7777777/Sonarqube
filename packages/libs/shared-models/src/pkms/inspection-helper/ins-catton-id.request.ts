import { CommonRequestAttrs } from "@xpparel/shared-models";

export class InsCartonIdsRequest extends CommonRequestAttrs {
    cartonIds?: number[];
    barcode?:string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, cartonIds?: number[],barcode?:string) {
        super(username, unitCode, companyCode, userId)
        this.cartonIds = cartonIds;
        this.barcode=barcode;
    }
}