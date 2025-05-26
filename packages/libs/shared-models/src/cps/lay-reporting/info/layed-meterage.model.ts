export class LayedMeterageModel {
    requestNumber : string;
    constructor(requestNumber : string
    ) {
        this.requestNumber = requestNumber;
        // this.docketGroup = docketGroup;
    }
}


export class TodayLayedCutAndMeterage {
    totalCuts : number;
    totalQuantity : number;
    constructor(totalCuts : number, totalQuantity : number
    ) {
        this.totalCuts = totalCuts;
        this.totalQuantity = totalQuantity;
    }

}