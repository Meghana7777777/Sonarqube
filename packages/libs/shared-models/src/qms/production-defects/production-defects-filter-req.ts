export class SewingDefectFilterReq{
    poId?:number;
    employeeId?:number;
    operationId?:number;
    testResult?:string;

    constructor(poId?:number,employeeId?:number,operationId?:number,testResult?:string){
        this.poId = poId
        this.employeeId = employeeId
        this.operationId = operationId
        this.testResult = testResult
    }

}