export class DateRequest {
    fromDate? : any ;
    toDate? : any;
    qualityTypeId? : number;
    constructor(fromDate? : any ,toDate? : any,qualityTypeId?:number){
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.qualityTypeId = qualityTypeId;

    }
}