import { CommonRequestAttrs } from "../../../common";
import { StockConsumptionModel } from "./stock-consumption.model";

export class StockConsumptionRequest extends CommonRequestAttrs {

    consumedStock: StockConsumptionModel[];
    
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        consumedStock: StockConsumptionModel[],
    ) {
        super(username, unitCode, companyCode, userId);
        this.consumedStock = consumedStock

    }
}