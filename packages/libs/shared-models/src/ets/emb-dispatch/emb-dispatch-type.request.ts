import { CommonRequestAttrs } from "../../common";
import { EmbDispatchStatusEnum } from "../enum";

export class EmbDispatchStatusRequest extends CommonRequestAttrs {

    dispatchStatus: EmbDispatchStatusEnum;
    iNeedDispatchLines: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        dispatchStatus: EmbDispatchStatusEnum,
        iNeedDispatchLines: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.dispatchStatus = dispatchStatus;
        this.iNeedDispatchLines = iNeedDispatchLines;
    }
}

// {
//     "companyCode": "5000",
//     "embLineIds": ["1"],
//     "remarks": "test",
//     "unitCode": "B3",
//     "dispatchStatus": "OP",
//     "username": "admin"
// }