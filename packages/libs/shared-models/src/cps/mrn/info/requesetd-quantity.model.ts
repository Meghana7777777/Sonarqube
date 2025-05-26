export class RequestQuantityModel {

    totalRequestedQuantityToday: number;

    constructor(
        totalRequestedQuantityToday: number

    ) {

        this.totalRequestedQuantityToday = totalRequestedQuantityToday;
    }

} 

export class MrnRequestInfoModel {
    totalRequestedQuantityToday: number;
    totalRequestedRequest: number;
    constructor(
        totalRequestedQuantityToday: number,
        totalRequestedRequest: number
    ) {
        this.totalRequestedQuantityToday = totalRequestedQuantityToday;
        this.totalRequestedRequest = totalRequestedRequest;
    }

}