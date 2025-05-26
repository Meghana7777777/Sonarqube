import { CommonRequestAttrs } from "../../../common";
import { PackListLoadingStatus } from "../../enum";

//for security screen for
//1.open=date(current) & OPEN
//2.INProgress=PackingListStatusEnum([SECURITY_IN,UNLOAD_START,UNLOAD_END])
//3.Completed=PackingListStatusEnum(SECURITY_OUT)
// TODO: grnDate , FROM AND TO
export class PackingListSummaryRequest extends CommonRequestAttrs {
    supplierCode: string;
    grnDateFrom: Date | undefined;
    grnDateTo: Date | undefined;
    securityStatus: PackListLoadingStatus[];
    from: number | undefined;
    to: number | undefined;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, supplierCode: string, grnDateFrom: Date | undefined, grnDateTo: Date | undefined, from: number | undefined, to: number | undefined, securityStatus: PackListLoadingStatus[]) {
        super(username, unitCode, companyCode, userId);
        this.supplierCode = supplierCode;
        this.grnDateFrom = grnDateFrom;
        this.grnDateTo = grnDateTo;
        this.from = from;
        this.to = to;
        this.securityStatus = securityStatus;
    }
}


