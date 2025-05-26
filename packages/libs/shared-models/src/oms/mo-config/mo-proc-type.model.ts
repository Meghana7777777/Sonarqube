import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum } from "../enum";

export class MC_MoProcessTypeModel extends CommonRequestAttrs {
    moNumber: string;
    procType: ProcessTypeEnum; 

    /**
     * Constructor for MC_MoProcessTypeModel
     * @param username - Username of the requester
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID of the requester
     * @param date - Optional request date
     * @param moNumber - Manufacturing order number
     * @param procType - Process type enum
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        moNumber: string,
        procType: ProcessTypeEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.moNumber = moNumber;
        this.procType = procType; 
    }
}
