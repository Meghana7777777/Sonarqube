import { CommonRequestAttrs } from "../common-request-attr.model";

export class MoPslIdsRequest extends CommonRequestAttrs {
    moPslIds: number[];

    /**
     * Constructor for MoProductSubLineIdsRequest
     * @param username - User's name
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID
     * @param moPslId - Array of MO product sub-line IDs
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        moPslIds:number[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.moPslIds = moPslIds;
    }
}
