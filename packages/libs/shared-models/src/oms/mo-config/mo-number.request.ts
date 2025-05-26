import { CommonRequestAttrs } from "../../common";

export class MC_MoNumberRequest extends CommonRequestAttrs {
    moNumber: string;

    /**
     * Constructor for MoNumberRequest
     * @param username - Username of the requester
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID of the requester
     * @param moNumber - Manufacturing Order Number
     * @param date - Optional request date
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        moNumber: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.moNumber = moNumber;
    }
}
