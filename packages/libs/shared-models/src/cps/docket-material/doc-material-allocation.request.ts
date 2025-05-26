import { CommonRequestAttrs } from "../../common";
import { DocRollsRequest } from "./doc-rolls.request";

export class DocMaterialAllocationRequest extends CommonRequestAttrs {
    // docketNumber: string;
    poSerial: number;
    rollsInfo: DocRollsRequest[];
    mrnRequestId: number;
    docketGroup: string;
    aMarkerName: string;
    aMarkerWidth: string;
    aMarkerLength: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        // docketNumber: string,
        rollsInfo: DocRollsRequest[],
        mrnRequestId: number,
        docketGroup: string,
        aMarkerName: string,
        aMarkerWidth: string,
        aMarkerLength: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.poSerial = poSerial;
        // this.docketNumber = docketNumber;
        this.docketGroup = docketGroup;
        this.rollsInfo = rollsInfo;
        this.mrnRequestId = mrnRequestId;
        this.aMarkerName = aMarkerName;
        this.aMarkerWidth = aMarkerWidth;
        this.aMarkerLength = aMarkerLength;
    }
}
