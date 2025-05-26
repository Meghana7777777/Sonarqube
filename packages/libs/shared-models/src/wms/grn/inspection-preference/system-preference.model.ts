import { CommonRequestAttrs } from "../../../common";
import { RollSelectionTypeEnum } from "../../enum";

export class SystemPreferenceModel extends CommonRequestAttrs{
    phId: number;
    rollSelectionType: RollSelectionTypeEnum;
    rollsPickPercentage: number;
    remarks: string;

    /**
     * 
     * @param username 
     * @param unitCode 
     * @param companyCode 
     * @param userId 
     * @param id 
     * @param barcode 
     * @param rollNotFound 
     * @param actualQuantity 
     * @param pickForInspection 
     * @param packingListId 
     * @param rollGrnInfo 
    */
    constructor(username: string, unitCode: string, companyCode: string, userId: number,  phId: number, rollSelectionType: RollSelectionTypeEnum, rollsPickPercentage: number, remarks: string) {
        super(username, unitCode, companyCode, userId);
        this.phId = phId;
        this.rollSelectionType = rollSelectionType;
        this.rollsPickPercentage = rollsPickPercentage;
        this.remarks = remarks;
    }
    
}