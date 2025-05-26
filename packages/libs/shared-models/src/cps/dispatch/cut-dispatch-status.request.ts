import { CommonRequestAttrs } from "../../common";
import { CutDispatchStatusEnum } from "../enum";

export class CutDispatchStatusRequest extends CommonRequestAttrs {

    dispatchStatus: CutDispatchStatusEnum;
    iNeedDispatchLines: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        dispatchStatus: CutDispatchStatusEnum,
        iNeedDispatchLines: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.dispatchStatus = dispatchStatus;
        this.iNeedDispatchLines = iNeedDispatchLines;
    }
}