export class GatePassResDto {
    from: string
    to: string
    gatePass: string
    createdDate: string
    transferOutOfSystem: string
    nonReturnable: string
    createdBy: string
    firstApproval: string
    finalApproval: string
    buyer: string
    style: string
    po: number
    color: string
    vehicleNo: string
    driverName: string
    lcNo: string
    challanNo: number
    lockNo: number
    mo: string
    receivedBy: string
    tableId: TableDto[]
    constructor(from: string,
        to: string,
        gatePass: string,
        createdDate: string,
        transferOutOfSystem: string,
        nonReturnable: string,
        createdBy: string,
        firstApproval: string,
        finalApproval: string,
        buyer: string,
        style: string,
        po: number,
        color: string,
        vehicleNo: string,
        driverName: string,
        lcNo: string,
        challanNo: number,
        lockNo: number,
        mo: string,
        receivedBy: string,
        tableId: TableDto[]
    ) {
        this.from = from
        this.createdBy = createdBy
        this.createdDate = createdDate
        this.finalApproval = finalApproval
        this.firstApproval = firstApproval
        this.from = from
        this.to = to
        this.gatePass = gatePass
        this.transferOutOfSystem = transferOutOfSystem
        this.nonReturnable = nonReturnable
        this.tableId = tableId
        this.buyer = buyer
        this.style = style
        this.po = po
        this.color = color
        this.vehicleNo = vehicleNo
        this.driverName = driverName
        this.lcNo = lcNo
        this.challanNo = challanNo
        this.lockNo = lockNo
        this.mo = mo
        this.receivedBy = receivedBy
    }
}

export class TableDto {
    id: number
    articleName: string
    color: string
    size: string
    unit: string
    qty: number
    constructor(
        id: number,
        articleName: string,
        color: string,
        size: string,
        unit: string,
        qty: number
    ) {
        this.id = id
        this.articleName = articleName
        this.color = color
        this.qty = qty
        this.size = size
        this.unit = unit
    }
}