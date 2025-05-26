import { InsFabricInspectionRequestCategoryEnum, InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum } from "../../enum";
import { InsRollDetails } from "./ins-roll-info.model";


export class InsPackListWiseInspectionReqDetails {
    CreationDate: string;
    requestId: string;                                    // Unique ID for each inspection request
    inspectionProcessType: InsFabricInspectionRequestCategoryEnum;         //  Type of inspection process
    packingListId: string;                                // Associated packing list ID
    totalPackingListRolls: InsRollDetails[];                 // Total rolls in the packing list ---------------(,optional,,we can keep number instead)
    RequestRolls: InsRollDetails[];                          // Total  rolls in this request
    startedRolls: InsRollDetails[];                          // Total rolls started the process
    completedRolls: InsRollDetails[];                        // Total  rolls completed the process
    requestStatus: InsInspectionActivityStatusEnum;                                // Overall status of the request
    requestResult: InsInspectionFinalInSpectionStatusEnum;                                // 0 - fail, 1 - pass, 2 -> default
    material: string;
    isDelayed: boolean;
}


