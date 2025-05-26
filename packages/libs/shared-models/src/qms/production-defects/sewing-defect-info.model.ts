export class SewingDefectInfoModel {
    poId: number;
    poNumber: string;
    customerId: number;
    customer: string;
    styleId: number;
    style: string;
    colorId: number;
    color: string;
    orderQty: number;
    sewingSampleQty: number;
    operationInfo: OperationInfos[];
    inspectedCount?: number
    qualityType?: string
    barcode?: string


    constructor(poId: number, poNumber: string, customerId: number, customer: string, styleId: number, style: string, colorId: number, color: string, orderQty: number, sewingSampleQty: number, operationInfo: OperationInfos[], inspectedCount?: number,
        qualityType?: string,
        barcode?: string
    ) {
        this.poId = poId
        this.poNumber = poNumber
        this.customerId = customerId
        this.customer = customer
        this.styleId = styleId
        this.style = style
        this.colorId = colorId
        this.color = color
        this.orderQty = orderQty
        this.sewingSampleQty = sewingSampleQty
        this.operationInfo = operationInfo
        this.inspectedCount = inspectedCount
        this.qualityType = qualityType
        this.barcode = barcode
    }
}

export class OperationInfos {
    employeeId: number;
    employee: string;
    operationId: number;
    operation: string;
    testResult: string;
    defectId: number;
    defect: string;
    qualityType?: string
    barcode?: string
    constructor(employeeId: number, employee: string, operationId: number, operation: string, testResult: string, defectId: number, defect: string,qualityType?: string, barcode?: string
    ) {
        this.employeeId = employeeId
        this.employee = employee
        this.operationId = operationId
        this.operation = operation
        this.testResult = testResult
        this.defectId = defectId
        this.defect = defect
        this.qualityType = qualityType
        this.barcode = barcode
    }
}