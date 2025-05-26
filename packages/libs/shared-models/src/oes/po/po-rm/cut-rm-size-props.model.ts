import { InsUomEnum } from "@xpparel/shared-models";

export class CutRmSizePropsModel {
    size: string;
    cons: number;
    uom: InsUomEnum;
    wastage: number;

    constructor(
        size: string,
        cons: number,
        uom: InsUomEnum,
        wastage: number,

    ) {
        this.size = size;
        this.cons = cons;
        this.uom = uom;
        this.wastage = wastage;
    }
}
