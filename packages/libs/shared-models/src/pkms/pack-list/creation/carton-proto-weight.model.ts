import { CartonWeightModel } from "./carton-weight.model";

export class CartonPrototypeWeightModel {
    id: number;
    itemId: number;
    boxMapId: number;
    itemCode: string;
    qty: number;
    noOfPBags: number;
    count: number;    
    netWeight: number;
    grossWeight: number;
    cartons: CartonWeightModel[]
    constructor(
        id: number,
        itemId: number,
        boxMapId: number,
        itemCode: string,
        noOfPBags: number,
        count: number,
        netWeight: number,
        grossWeight: number,
        cartons: CartonWeightModel[]
    ) {
        this.id = id;
        this.itemId = itemId;
        this.boxMapId = boxMapId;
        this.itemCode = itemCode;
        this.noOfPBags = noOfPBags;
        this.count = count;
        this.cartons = cartons;
        this.netWeight = netWeight;
        this.grossWeight = grossWeight;
    }
}