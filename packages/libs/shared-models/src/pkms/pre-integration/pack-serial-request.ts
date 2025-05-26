import { CommonRequestAttrs } from "../../common";

export class PackSerialRequest extends CommonRequestAttrs {
    packSerial: number;
    id: number;
    iNeedSubLines: boolean;
    iNeedOqPercentages: boolean;
    poLine?: number;
    subLineId?: number;
    moNumber?: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        packSerial: number,
        id: number,
        iNeedSubLines: boolean,
        iNeedOqPercentages: boolean,
        moNumber?: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.packSerial = packSerial;
        this.id = id;
        this.iNeedOqPercentages = iNeedOqPercentages;
        this.iNeedSubLines = iNeedSubLines;
        this.moNumber = moNumber;
    }
}