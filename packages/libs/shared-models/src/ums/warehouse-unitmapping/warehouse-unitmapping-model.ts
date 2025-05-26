import { CommonRequestAttrs } from "../../common";

export class WarehouseUnitmappingModel  {
    id?: number;
    warehouseCode: string;
    unitsCode: string;
    companysCode: string;
    isActive: boolean;

    constructor(
       
        id: number,
        warehouseCode: string,
        unitsCode: string,
        companysCode: string,
        isActive: boolean
    ) {
        this.id = id;
        this.warehouseCode = warehouseCode;
        this.unitsCode = unitsCode;
        this.companysCode = companysCode;
        this.isActive = isActive;
    }
}