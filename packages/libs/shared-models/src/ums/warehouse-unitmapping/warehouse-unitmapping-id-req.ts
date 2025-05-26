import { CommonRequestAttrs } from "../../common";

export class WarehouseUnitmappingIdRequest extends CommonRequestAttrs {
    id?: number;

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id?: number
    ) {
        super(userName, unitCode, companyCode, userId);
        this.id = id;
    }
}