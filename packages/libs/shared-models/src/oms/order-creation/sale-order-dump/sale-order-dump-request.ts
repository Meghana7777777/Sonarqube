import { CommonRequestAttrs } from "@xpparel/shared-models";
import { SaleOrderDumpModel } from "./sale-order-dump-model";

export class SaleOrderDumpRequest extends CommonRequestAttrs {
    saleOrderDumpData: SaleOrderDumpModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        saleOrderDumpData: SaleOrderDumpModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.saleOrderDumpData = saleOrderDumpData;
    }
}