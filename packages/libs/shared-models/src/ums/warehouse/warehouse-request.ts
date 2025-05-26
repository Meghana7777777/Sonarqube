import { CommonRequestAttrs } from "../../common";
import { WarehouseModel } from "./warehouse-model";

export class WarehouseRequest extends CommonRequestAttrs{
    warehouses: WarehouseModel
    
    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        warehouses: WarehouseModel
    ) {
        super(userName, unitCode, companyCode, userId);
        this.warehouses = warehouses;
    }
}