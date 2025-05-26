export class MeasuredWidthModel {
    width: number;
    measuredRef: string;
    order: number;
    constructor(width: number, measuredRef: string, order: number) {
        this.width = width;
        this.measuredRef = measuredRef;
        this.order = order;
    }
}