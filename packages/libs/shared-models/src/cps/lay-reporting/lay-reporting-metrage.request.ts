
export class LayerMeterageRequest  {
    unitCode: string;
    companyCode: string;
    date: string;
    requestNumber: number;
    docketGroup: string;
    cutNumber: number;
    docketNumber : number;

    constructor(unitCode: string,
        companyCode: string,
        date: string,
        requestNumber: number,
        docketGroup: string,
        cutNumber: number,
    docketNumber : number
    ) {
        this.unitCode = unitCode;
        this.companyCode = companyCode;
        this.date = date;
        this.requestNumber = requestNumber;
        this.docketGroup = docketGroup;
        this.cutNumber = cutNumber;
        this.docketNumber = docketNumber;

    }
}