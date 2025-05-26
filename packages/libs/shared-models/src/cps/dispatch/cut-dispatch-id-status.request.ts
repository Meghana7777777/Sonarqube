import { CommonRequestAttrs } from "../../common";
import { CutDispatchStatusEnum } from "../enum";

interface ICurDrOutInfo {
    vehicleOutAt: string; // YYYY-MM-DD HH:MM:SS
}

export class CutDispatchIdStatusRequest extends CommonRequestAttrs {

    cutDispatchId: number; // Mandatory: The PK of the Cut dispatch request
    dispatchStatus: CutDispatchStatusEnum; // not required during delete call
    outInfo?: ICurDrOutInfo; // Utilized for the vehicle out info capturing during the security out

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        cutDispatchId: number,
        dispatchStatus: CutDispatchStatusEnum,
        outInfo?: ICurDrOutInfo
    ) {
        super(username, unitCode, companyCode, userId);
        this.cutDispatchId = cutDispatchId;
        this.dispatchStatus = dispatchStatus;
        this.outInfo = outInfo;
    }
}