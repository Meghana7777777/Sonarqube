import { CommonRequestAttrs } from "../../common";

export class CompanyIdRequest extends CommonRequestAttrs {
    id?: number;
    companyName?: string;

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id?: number,
        companyName?: string,

    ) {
        super(userName, unitCode, companyCode, userId);
        this.id = id;
        this.companyName = companyName;
    }
}