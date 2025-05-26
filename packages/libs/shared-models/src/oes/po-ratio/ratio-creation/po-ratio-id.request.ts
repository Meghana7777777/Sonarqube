import { CommonRequestAttrs } from "../../../common";

export class PoRatioIdRequest extends CommonRequestAttrs {
    poSerial: number;
    poRatioId: number;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        poRatioId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.poRatioId = poRatioId;
        this.poSerial  = poSerial;
    }

}

export class PoRatioSizeRequest extends CommonRequestAttrs {
    poRatioId: number;
    poRatioLinesId: number;
    poRatioSize: string;
    poRatio: number;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poRatioId: number,
        poRatioLinesId: number,
        poRatioSize: string,
        poRatio: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.poRatioId = poRatioId;
        this.poRatioLinesId = poRatioLinesId;
        this.poRatioSize  = poRatioSize;
        this.poRatio = poRatio;
    }
}