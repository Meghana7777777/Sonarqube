import { GlobalResponseObject } from "@xpparel/shared-models"

export class RollMoAbtractInfoQueryResponse {
    style: string
    mo: string
    rollId: string
    rollBarcode: string

    constructor(style: string,
        mo: string,
        rollId: string,
        rollBarcode: string) {

        this.style = style;
        this.mo = mo;
        this.rollId = rollId;
        this.rollBarcode = rollBarcode;

    }
}

