import { CommonRequestAttrs } from "@xpparel/shared-models";
import { ManufacturingOrderDumpModel } from "./manf-order-dump-model";

export class ManufacturingOrderDumpRequest extends CommonRequestAttrs{
    manufacturingOrderDumpData:ManufacturingOrderDumpModel[];
   
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        manufacturingOrderDumpData: ManufacturingOrderDumpModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.manufacturingOrderDumpData = manufacturingOrderDumpData;
    }
}