
export class InsInspectionRequest  {
   
    username: string;
    unitCode: string;
    companyCode: string;
    userId: number;
    date: string;
    
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        date: string
    )  {
        this.username = username;
        this.unitCode = unitCode;
        this.companyCode = companyCode;
        this.userId = userId;
        this.date = date
    }
}