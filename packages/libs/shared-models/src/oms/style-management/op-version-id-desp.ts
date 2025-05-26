export class OpVersionIdDesp {
    operatinoVersionId: number;
    operationVersionName : string;
    operationVersionDesc: string;

    constructor(
        operatinoVersionId: number,
        operationVersionName : string,
        operationVersionDesc: string
    ) {
        this.operatinoVersionId = operatinoVersionId;
        this.operationVersionDesc = operationVersionDesc;
        this.operationVersionName = operationVersionName;
    }
}

export class OpVersionReq{
    username: string;
    unitCode: string;
    companyCode: string;
    userId: number;
    date?: string;
    page?: number;
    limit?: number;
    style?: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,date?: string,page?: number,limit?: number,style?: string
    ) {
        this.username = username;
        this.unitCode = unitCode;
        this.companyCode = companyCode;
        this.userId = userId;
        this.date = date;
        this.page = page;
        this.limit = limit;
        this.style = style;
    }
}


