import { CommonRequestAttrs } from "../../common";


export class PoRatioIdMarkerIdRequest extends CommonRequestAttrs {
    poSerial: number;
    poRatioId: number;
    poMarkerId: number;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        poRatioId: number,
        poMarkerId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.poRatioId = poRatioId;
        this.poSerial  = poSerial;
        this.poMarkerId = poMarkerId;
    }

}