export class TimeBasedCount {
    rangedDate: string;// x-axis title
    actualCount: number;//
    expectedCount: number;//

    constructor(
        rangedDate: string,// x-axis title
        actualCount: number,//
        expectedCount: number){
            this.actualCount=actualCount;
            this.expectedCount=expectedCount;
            this.rangedDate = rangedDate;

    }
}