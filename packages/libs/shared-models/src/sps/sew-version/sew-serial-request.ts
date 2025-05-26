import { CommonRequestAttrs } from "../../common";

export class SewSerialRequest extends CommonRequestAttrs {
    poSerial: number;
    id: number;

    iNeedSubLines: boolean;
    iNeedOqPercentages: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        id: number,
        iNeedSubLines: boolean,
        iNeedOqPercentages: boolean,
    ){
        super(username, unitCode, companyCode, userId);

        this.poSerial = poSerial;
        this.id = id;
        this.iNeedOqPercentages = iNeedOqPercentages;
        this.iNeedSubLines = iNeedSubLines;
    }
}


// {
//     "companyCode": "5000",
//     "unitCode": "B3",
//     "poSerial": 112
// }

