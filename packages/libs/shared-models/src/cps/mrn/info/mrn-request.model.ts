import { DocRollsModel } from "../../docket-material";
import { CutStatusEnum, LayingStatusEnum, MrnStatusEnum } from "../../enum";

export class MrnRequestModel  {

    mrnReqId: number;
    poSerial: number;
    docketNumber: string;
    cutNumber: string;
    remarks: string;
    mrnStatus: MrnStatusEnum;
    mrnReqNo: string;
    cutStatus: CutStatusEnum;
    layStatus: LayingStatusEnum;
    totalMrnReqQty: number;
    rollsInfo: DocRollsModel[];

    constructor(
        poSerial: number,
        docketNumber: string,
        cutNumber: string,
        remarks: string,
        mrnStatus: MrnStatusEnum,
        mrnReqNo: string,
        mrnReqId: number,
        cutStatus: CutStatusEnum,
        layStatus: LayingStatusEnum,
        totalMrnReqQty: number,
        rollsInfo: DocRollsModel[],
    ) {
        this.poSerial = poSerial;
        this.docketNumber = docketNumber;
        this.cutNumber = cutNumber;
        this.remarks = remarks;
        this.mrnStatus = mrnStatus;
        this.mrnReqNo = mrnReqNo;
        this.mrnReqId = mrnReqId;
        this.cutStatus = cutStatus;
        this.layStatus = layStatus;
        this.rollsInfo = rollsInfo;
        this.totalMrnReqQty = totalMrnReqQty;
    }
}
