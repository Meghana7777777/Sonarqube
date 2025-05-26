export class CartonWeightModel{
    id:number;
    barCode: string;
    netWeight: number;
    grossWeight: number;
    constructor(id: number, barCode: string, netWeight: number, grossWeight: number) {
        this.id = id;
        this.barCode = barCode;
        this.netWeight = netWeight;
        this.grossWeight = grossWeight;
    }
}