import { CommonRequestAttrs } from "../../../common";
import { DocGenStatusEnum } from "../../enum";

export class RatioDocGenStatusRequest extends CommonRequestAttrs {
    poSerial: number;
    ratioId: number;
    docGenStatus: DocGenStatusEnum;

    constructor(username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number, 
        ratioId: number,
        docGenStatus: DocGenStatusEnum) {
        super(username, unitCode, companyCode, userId);
        this.ratioId = ratioId;
        this.poSerial = poSerial;
        this.docGenStatus = docGenStatus;
    }
}