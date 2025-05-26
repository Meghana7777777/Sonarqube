import { WarehouseModel } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../common/common-request-attr.model";

export class WarehouseCreateRequest extends CommonRequestAttrs {
    warehouses: WarehouseModel[];

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        warehouses: WarehouseModel[]
    ) {
        super(userName, unitCode, companyCode, userId);
        this.warehouses = warehouses;
    }
}