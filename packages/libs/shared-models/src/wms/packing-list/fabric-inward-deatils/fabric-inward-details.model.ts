export class FabricInwardDetailsModel {
    inwardDate: string;
    inwardNo: string;
    supplierName: string;
    invoiceNo: string;
    poNumber: string;
    styleNo: string;
    rollQty: string;
    meters: string;
    netWeight: number;
    grossWeight: number;
    cusDecNo: string;
    vehicalNo: number;
    containerNo: string;
    inAt: string;
    outAt: string;
    outTime: string;
    remarks: string;
    deliveryDate: string
    constructor(
        inwardDate: string,
        inwardNo: string,
        supplierName: string,
        invoiceNo: string,
        poNumber: string,
        styleNo: string,
        rollQty: string,
        meters: string,
        netWeight: number,
        grossWeight: number,
        cusDecNo: string,
        vehicalNo: number,
        containerNo: string,
        inAt: string,
        outAt: string,
        outTime: string,
        remarks: string,
        deliveryDate: string) {
        this. inwardDate =  inwardDate;
        this. inwardNo =  inwardNo;
        this.supplierName = supplierName;
        this.invoiceNo = invoiceNo;
        this.poNumber = poNumber;
        this.styleNo = styleNo;
        this.poNumber = poNumber;
        this.rollQty = rollQty;
        this.meters = meters;
        this.netWeight = netWeight;
        this.grossWeight = grossWeight;
        this.cusDecNo = cusDecNo;
        this.vehicalNo = vehicalNo;
        this.containerNo = containerNo;
        this.inAt = inAt;
        this.outAt = outAt;
        this.outTime = outTime;
        this.remarks = remarks;
        this.deliveryDate = deliveryDate;
    }
}