import { CommonRequestAttrs } from "../../common";  
import { PackJobStatusEnum } from "../enum";


export class InspectionApprovalRequest extends CommonRequestAttrs {
    inspectionRequestId: number;
    approvedPerson: string;
    remarks: string;
    inpsectionStatus: PackJobStatusEnum;
}
