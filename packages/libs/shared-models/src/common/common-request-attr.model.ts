
export class CommonRequestAttrs {
    username: string;
    unitCode: string;
    companyCode: string;
    userId: number;
 

    constructor(username: string, unitCode: string, companyCode: string, userId: number
    ) {
        this.username = username;
        this.unitCode = unitCode;
        this.companyCode = companyCode;
        this.userId = userId;
     
    }
}