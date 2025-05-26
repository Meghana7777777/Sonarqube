import { CommonRequestAttrs } from "../../common";
import { InsInspectionStatusEnum } from "../enum";


export class InsInspectionApprovalRequest extends CommonRequestAttrs {
    inspectionRequestId: number;
    approvedPerson: string;
    remarks: string;
    inpsectionStatus: InsInspectionStatusEnum;
}
