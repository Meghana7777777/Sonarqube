import { CommonRequestAttrs } from "../../../common";

export class PoLineIdRequest extends CommonRequestAttrs {
    poSerial: number;
    poLineId: number;
    style ?: string;
    color ?: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        poLineId: number,
        style ?: string,
        color ?: string,

    )
    {
        super(username, unitCode, companyCode, userId);

        this.poSerial = poSerial;
        this.poLineId = poLineId;
        this.style = style;
        this.color = color;
    }
}