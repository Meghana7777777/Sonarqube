export class PLArrivalDetails {
    packingListNumber: string;
    scheduleArrivalDateTime: Date;
    
    actualArrivalDateTime: Date;
    vehicleNumber: string;
    weight: number;
    noOfRolls: number;
    materialItemCode: string;

    constructor(
        packingListNumber: string,
        scheduleArrivalDateTime: Date,
        actualArrivalDateTime: Date,
        weight: number,
        noOfRolls: number,
        materialItemCode: string
    ) {
        this.packingListNumber = packingListNumber;
        this.scheduleArrivalDateTime = scheduleArrivalDateTime;
        this.actualArrivalDateTime = actualArrivalDateTime;
        this.weight = weight;
        this.noOfRolls = noOfRolls;
        this.materialItemCode = materialItemCode;
    }
}
