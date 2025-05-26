
export class OslIdFgsSpsModel {
    fgNums: number[];
    sewSerial: number;
    oslRefId: number;

    constructor(
        fgNums: number[],
        sewSerial: number,
        oslRefId: number
    ) {
        this.fgNums = fgNums;
        this.sewSerial = sewSerial;
        this.oslRefId = oslRefId;
    }
}

