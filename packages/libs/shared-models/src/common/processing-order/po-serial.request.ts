import { ProcessTypeEnum } from "../../oms";
import { CommonRequestAttrs } from "../common-request-attr.model";


// {
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "processingSerial": 3,
//     "processingType": "LINK"
// }


export class PO_PoSerialRequest extends CommonRequestAttrs {
    processingSerial: number;
    processingType: ProcessTypeEnum

    /**
     * Constructor for PO_PoSerialRequest
     * @param username - User's name
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID
     * @param processingSerial - Processing serial number
     * @param date - (Optional) Request date
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        processingSerial: number,
        processingType: ProcessTypeEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.processingSerial = processingSerial;
        this.processingType = processingType;
    }
}
