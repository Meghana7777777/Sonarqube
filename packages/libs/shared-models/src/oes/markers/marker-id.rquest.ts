import { CommonRequestAttrs } from "../../common";

export class MarkerIdRequest extends CommonRequestAttrs {
    markerId: number;

    constructor(
        username: string, unitCode: string, companyCode: string, userId: number,
        markerId: number
    ) {
        super(username,unitCode,companyCode,userId);
        this.markerId = markerId;
    }
}