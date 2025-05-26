import { BoxMapReqDto } from "./box-map-req";

export class CartonSpecModel {
    specId: number;
    specCode: string;
    specDesc: string;
    cartonId: number;
    cartonBoxId: number;
    cartonName: string;
    cartonUniqueKey: string;
    lineId: number;
    polyBags: BoxMapReqDto[]
    constructor(
        specId: number,
        specCode: string,
        specDesc: string,
        cartonId: number,
        cartonBoxId: number,
        cartonName: string,
        polyBags: BoxMapReqDto[]
    ) {
        this.specId = specId;
        this.specCode = specCode;
        this.specDesc = specDesc;
        this.cartonId = cartonId;
        this.cartonBoxId = cartonBoxId;
        this.cartonName = cartonName;
        this.polyBags = polyBags;
    }
}