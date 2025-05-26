import { CommonRequestAttrs } from "../../common";

export class WarehouseIdRequest extends CommonRequestAttrs{
    id?: number;
    warehouseName?: string;

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id?: number,
        warehouseName?: string,

    ) {
        super(userName, unitCode, companyCode, userId);
        this.id = id;
        this.warehouseName = warehouseName;
    }
}