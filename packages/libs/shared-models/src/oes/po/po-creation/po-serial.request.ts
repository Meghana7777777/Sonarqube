import { CommonRequestAttrs } from "../../../common";


// {
//     "poSerial": 55,
//     "username": "rajesh",
//     "unitCode": "B3",
//     "companyCode": "5000"
// }
export class PoSerialRequest extends CommonRequestAttrs {
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
//     "username": "rajesh",
//     "unitCode": "B3",
//     "companyCode": "5000",
//     "userId": 0,
//     "poSerial": 1
// }