import { CommonRequestAttrs } from "../../../common";


export class PONoRequest extends CommonRequestAttrs {
    packSerial: number;
    poLine: string;
    subLineId: string;
    constructor(
        username: string,
        userId: number,
        unitCode: string,
        companyCode: string,
        packSerial: number,
        poLine: string,
        subLineId?: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.packSerial = packSerial;
        this.poLine = poLine;
        this.subLineId = subLineId;
    }
}
