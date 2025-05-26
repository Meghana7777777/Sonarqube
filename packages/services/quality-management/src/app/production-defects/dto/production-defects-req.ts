import { ApiProperty } from "@nestjs/swagger";

export class SewingDefectReq{
    @ApiProperty()
    poNumber: string;

    @ApiProperty()
    customerId: number;

    @ApiProperty()
    styleId: number;

    @ApiProperty()
    colorId: number;

    @ApiProperty()
    role: string;

    @ApiProperty()
    operationInfo: OperationInfo[]

    constructor(poNumber: string,customerId: number,styleId: number,colorId: number,role: string,operationInfo: OperationInfo[]){
        this.poNumber = poNumber
        this.customerId = customerId
        this.styleId = styleId
        this.colorId = colorId
        this.role = role
        this.operationInfo = operationInfo

    }
}

export class OperationInfo{
    @ApiProperty()
    operationId: number;

    @ApiProperty()
    defectId: number;

    @ApiProperty()
    testResult: string;

    constructor(operationId: number,defectId: number,testResult: string){
        this.operationId = operationId
        this.defectId = defectId
        this.testResult = testResult

    }

}

export class ProductionDefectDto{
    @ApiProperty()
    poNumber: string;

    @ApiProperty()
    customerId: number;

    @ApiProperty()
    styleId: number;

    @ApiProperty()
    colorId: number;

    @ApiProperty()
    role: string;

    @ApiProperty()
    operationId: number;

    @ApiProperty()
    qualityTypeId: number;

    @ApiProperty()
    defectId: number;

    @ApiProperty()
    testResult: string;

    @ApiProperty()
    poId: number;

    @ApiProperty()
    employeeId: number;

    @ApiProperty()
    employeeName: string;

    @ApiProperty()
    barcode: string;

    constructor(poNumber: string,customerId: number,styleId: number,colorId: number,role: string,operationId: number,defectId: number,testResult: string,poId:number,employeeId:number,employeeName:string,barcode:string){
        this.poNumber = poNumber
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