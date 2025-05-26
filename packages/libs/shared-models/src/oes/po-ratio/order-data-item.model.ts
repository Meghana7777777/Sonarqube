
export class YYRatio {
    ratioName: string;
    ratioCode: string;
    ratioRequirement: number;
    ratioQuantity: number;
}
export class OrderItemDetailsModel {
    date: Date;
    customer: string;
    customerCode: string;
    profitCenter: string;
    profitCenterCode: string;
    so: string;
    plantStyleRef: string;
    colour: string;
    itemCode: string;
    bookingYy: number;
    cuttableYy: number;
    yySaving: number;
    yySavingPercentage: number;
    actualYy: number;
    actualYySaving: number;
    actualYySavingPercentage: number;
    averageCutWidth: number;
    ratios: YYRatio[]
    totalRequirement:number;
    totalQuantity:number;
    constructor(date: Date,
        customer: string,
        customerCode: string,
        profitCenter: string,
        profitCenterCode: string,
        so: string,
        plantStyleRef: string,
        colour: string,
        itemCode: string,
        bookingYy: number,
        cuttableYy: number,
        yySaving: number,
        yySavingPercentage: number,
        actualYy: number,
        actualYySaving: number,
        actualYySavingPercentage: number,
        averageCutWidth: number,
        totalRequirement:number,
        totalQuantity:number,
        ratios: YYRatio[]
    ) {
        this.date = date;
        this.customer = customer;
        this.customerCode = customerCode;
        this.profitCenter = profitCenter;
        this.profitCenterCode = profitCenterCode;
        this.so = so;
        this.plantStyleRef = plantStyleRef;
        this.colour = colour;
        this.itemCode = itemCode;
        this.bookingYy = bookingYy;
        this.cuttableYy = cuttableYy;
        this.yySaving = yySaving;
        this.yySavingPercentage = yySavingPercentage;
        this.actualYy = actualYy;
        this.actualYySaving = actualYySaving;
        this.actualYySavingPercentage = actualYySavingPercentage;
        this.averageCutWidth = averageCutWidth;
        this.ratios = ratios;
        this.totalRequirement = totalRequirement;
        this.totalQuantity = totalQuantity;
    }
}