
export class SoLineIdsModel {

    orderLineId: number;
    subLineIds: number[]; //this will not come for po creation 

    constructor(
        orderLineId: number,
        subLineIds: number[],

    )
    {
        this.orderLineId = orderLineId;
        this.subLineIds = subLineIds;
    }
}

