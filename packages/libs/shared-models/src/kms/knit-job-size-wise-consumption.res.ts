import { GlobalResponseObject } from "../common";

export class KnitJobSizeWiseConsumptionResponse extends GlobalResponseObject{
    data: KnitJobSizeWiseConsumptionModel[];
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: KnitJobSizeWiseConsumptionModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class KnitJobSizeWiseConsumptionModel {
    itemCode: string;
    component: string;
    sizeCons?: { 
      size: string;
      cons: number; 
    }[];

    constructor(
      itemCode: string,
      component: string,
      sizeCons?: { size: string; cons: number }[]
    ) {
      this.itemCode = itemCode;
      this.component = component;
      this.sizeCons = sizeCons;
    }
  }