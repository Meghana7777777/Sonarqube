import { CommonRequestAttrs } from "../../../common";

export class PoDocketOpCodeRequest extends CommonRequestAttrs {
    docketNumber: string;
    doNoThrowErrorIfSomethingIsMissing?: boolean; // this param is useful in certain cases where you do not want to throw an error if something is not present. Instead you want a success response with no proper keys/arrays/objects
    operationCode: string; // This is only required when trying to filter the emb barcodes for the emb job

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        docketNumber: string,
        operationCode: string,
        doNoThrowErrorIfSomethingIsMissing?: boolean
    
    ) {
        super(username, unitCode, companyCode, userId);
        this.docketNumber = docketNumber;
        this.operationCode = operationCode;
        this.doNoThrowErrorIfSomethingIsMissing = doNoThrowErrorIfSomethingIsMissing;
    }
}

// {
//     "username": "admin",
//     "unitCode": "B3",
//     "companyCode": "5000",
//     "userId": 0,
//     "poSerial": "1",
//     "docketNumber": "20",
//     "iNeedAllocatedRollsAlso": false,
//     "iNeedSizes": false,
//     "sizeCompPanelInfo": null
// }