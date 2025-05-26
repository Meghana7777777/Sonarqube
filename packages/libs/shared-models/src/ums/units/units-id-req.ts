import { CommonRequestAttrs } from "../../common";

export class UnitsIdRequest extends CommonRequestAttrs {
    id?: number;
    unitName?: string;

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id?: number,
        unitName?: string,

    ) {
        super(userName, unitCode, companyCode, userId);
        this.id = id;
        this.unitName = unitName;
    }
}