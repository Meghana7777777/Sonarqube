import { CommonRequestAttrs } from "../../common";
import { WarehouseUnitmappingModel } from "./warehouse-unitmapping-model";

export class WarehouseUnitmappingRequest extends CommonRequestAttrs {
    warehouseUnitmappings: WarehouseUnitmappingModel;

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        warehouseUnitmappings: WarehouseUnitmappingModel
    ) {
        super(userName, unitCode, companyCode, userId);
        this.warehouseUnitmappings = warehouseUnitmappings;
    }
}