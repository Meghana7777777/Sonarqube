import { CommonRequestAttrs } from "../../../common";
import { MrnStatusEnum } from "../../enum";

export class MrnStatusRequest extends CommonRequestAttrs {
    mrnStatus: MrnStatusEnum[]; // Mandatory in any case. Either for reports rendering or ui rendering
    iNeedRollsInfo: boolean;
    poSerials?: number[]; // Optional. Mandatory only for the MRN ui screens. For reports, this may be optional

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        mrnStatus: MrnStatusEnum[],
        iNeedRollsInfo: boolean,
        poSerials: number[],
    ) {
        super(username, unitCode, companyCode, userId);
        this.mrnStatus = mrnStatus;
        this.poSerials = poSerials;
        this.iNeedRollsInfo = iNeedRollsInfo;
    }
}