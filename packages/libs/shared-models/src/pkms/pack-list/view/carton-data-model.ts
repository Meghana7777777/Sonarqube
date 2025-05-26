
export class CartonDataForEachPl {
    packListNo: string
    packLists: CartonDataModel[];
    packListId: number;
    constructor(
        packListNo: string,
        packLists: CartonDataModel[],
        packListId: number
    ) {
        this.packListNo = packListNo;
        this.packLists = packLists;
        this.packListId = packListId;
    }
}



export class CartonDataModel {
    packJobNo: string;
    barCode: string
    itemCode: string;
    itemDesc: string;
    requiredQty: number;
    length: number;
    width: number;
    height: number;
    buyerAddress: string;
    deliverDate: string;
    exFactory: string;
    style: string;
    pickForInspection: boolean;
    constructor(
        packJobNo: string,
        barCode: string,
        itemCode: string,
        itemDesc: string,
        requiredQty: number,
        length: number,
        width: number,
        height: number,
        buyerAddress: string,
        deliverDate: string,
        exFactory: string,
        inCoterm: string,
        style: string,
        pickForInspection: boolean
    ) {
        this.packJobNo = packJobNo;
        this.barCode = barCode
        this.itemCode = itemCode;
        this.itemDesc = itemDesc;
        this.requiredQty = requiredQty;
        this.length = length;
        this.width = width;
        this.height = height;
        this.buyerAddress = buyerAddress;
        this.deliverDate = deliverDate;
        this.exFactory = exFactory;
        this.style = style;
        this.pickForInspection = pickForInspection;
    }




}