export class DateUnitCompanyRequest {
    date: string;
    unitCode: string;
    companyCode: string;

    constructor(date: string,
        unitCode: string,
        companyCode: string,) {
            this.date = date;
            this.unitCode = unitCode;
            this.companyCode = companyCode;
    }
}