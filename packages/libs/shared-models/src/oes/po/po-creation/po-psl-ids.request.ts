import { CommonRequestAttrs } from "../../../common";


export class PO_C_PoSerialPslIdsRequest extends CommonRequestAttrs {
    poSerial: number;
    pslIds: number[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        pslIds: number[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.poSerial = poSerial;
        this.pslIds = pslIds;
    }
}