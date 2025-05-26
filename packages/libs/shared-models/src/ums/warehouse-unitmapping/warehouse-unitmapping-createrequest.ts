import { WarehouseUnitmappingModel } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../common/common-request-attr.model";

export class WarehouseUnitmappingCreateRequest extends CommonRequestAttrs {
    warehouseUnitmappings: WarehouseUnitmappingModel[];

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        warehouseUnitmappings: WarehouseUnitmappingModel[]
    ) {
        super(userName, unitCode, companyCode, userId);
        this.warehouseUnitmappings = warehouseUnitmappings;
    }
}