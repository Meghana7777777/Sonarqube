export class ProdcutionDefectReq{    
    poNumber: number;
    qualityTypeId: number;
    customerId: number;
    styleId: number;
    colorId: number;
    role: string;
    operationId: number;
    defectId: number;
    testResult: string;
    poId:number;
    employeeName:string
    employeeId:number;
    barcode:string;

    constructor(poNumber: number,qualityTypeId:number,customerId: number,styleId: number,colorId: number,role: string,operationId: number,defectId: number,testResult: string,poId:number,employeeName:string,employeeId:number,barcode:string){
        this.poNumber = poNumber
        this.qualityTypeId = qualityTypeId
        this.customerId = customerId
        this.styleId = styleId
        this.colorId = colorId
        this.role = role
        this.operationId = operationId
        this.defectId = defectId
        this.testResult = testResult
        this.poId = poId
        this.employeeId = employeeId
        this.employeeName = employeeName
        this.barcode = barcode

    }
}