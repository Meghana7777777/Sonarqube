import { RollInfoModel } from "../packing-list";

export class GrnDetailsReportModel {
    grnNo: string;
    grnDate: string;
    supplier: string;
    poNumber: string;
    poQtyMtr: number;
    invoiceNumber: string;
    businessUnit: string;
    profitCentre: string;
    customer: string;
    garmentVendor: string;
    supplierPackingListNumber: string;
    wmsPackingListRefNo: string;
    manufacturingOrderNumber: string;
    styleNumber: string;
    itemNo: string;
    description: string;
    color: string;
    lotNo: string;
    rollNo: string;
    qty: number;
    uom: string;
    grnStatus: string;
    objectType: string;
    palletCode: string;
    palletState: string;
    palletAssignedLocation: string;
    palletConfirmedLocation: string;
    grnRollDateConfirmed: string;
    balanceQty: number;
    issuedQty: number;
    barcodeNumber: string;
    issuedDate: string;
    inputWidth: string;
    inputWidthUom: string;
    inputWidthCm: string;
    actGrnDate: string;
    actIssueDate: string;
    allocatedQty: number;
    consumedQty: number;
    relaxedWidth: string;
    relaxedDateTime: string;
    relaxedDate: string;
    shade:string;
    remark:string;

    /**
     * 
     * @param grnNo 
     * @param grnDate 
     * @param supplier 
     * @param poNumber 
     * @param poQtyMtr 
     * @param invoiceNumber 
     * @param businessUnit 
     * @param profitCentre 
     * @param customer 
     * @param garmentVendor 
     * @param supplierPackingListNumber 
     * @param wmsPackingListRefNo 
     * @param manufacturingOrderNumber 
     * @param styleNumber 
     * @param itemNo 
     * @param description 
     * @param color 
     * @param lotNo 
     * @param rollNo 
     * @param qty 
     * @param uom 
     * @param grnStatus 
     * @param objectType 
     * @param palletCode 
     * @param palletState 
     * @param palletAssignedLocation 
     * @param palletConfirmedLocation 
     * @param grnRollDateConfirmed 
     * @param balanceQty 
     * @param issuedQty 
     * @param barcodeNumber 
     * @param issuedDate 
     * @param inputWidth 
     * @param inputWidthUom
     * @param inputWidthCm
     * @param actGrnDate
     * @param actIssueDate
     * @param allocateQty
     * @param consumedQty
     * @param relaxedWidth
     * @param relaxedDateTime
     * @param relaxedDate
     * @param shade
     * @param remark
     */
    constructor(grnNo: string,
        grnDate: string,
        supplier: string,
        poNumber: string,
        poQtyMtr: number,
        invoiceNumber: string,
        businessUnit: string,
        profitCentre: string,
        customer: string,
        garmentVendor: string,
        supplierPackingListNumber: string,
        wmsPackingListRefNo: string,
        manufacturingOrderNumber: string,
        styleNumber: string,
        itemNo: string,
        description: string,
        color: string,
        lotNo: string,
        rollNo: string,
        qty: number,
        uom: string,
        grnStatus: string,
        objectType: string,
        palletCode: string,
        palletState: string,
        palletAssignedLocation: string,
        palletConfirmedLocation: string,
        grnRollDateConfirmed: string,
        balanceQty: number,
        issuedQty: number,
        barcodeNumber: string,
        issuedDate: string,
        inputWidth: string,
        inputWidthUom: string,
        inputWidthCm: string,
        actGrnDate: string,
        actIssueDate: string,
        allocatedQty: number,
        consumedQty:number,
        relaxedWidth:string,
        relaxedDateTime:string,
        relaxedDate:string,
        shade:string,
        remark:string,
        ) {
        this.grnNo = grnNo;
        this.grnDate = grnDate;
        this.supplier = supplier;
        this.poNumber = poNumber;
        this.poQtyMtr = poQtyMtr;
        this.invoiceNumber = invoiceNumber;
        this.businessUnit = businessUnit;
        this.profitCentre = profitCentre;
        this.customer = customer;
        this.garmentVendor = garmentVendor;
        this.supplierPackingListNumber = supplierPackingListNumber;
        this.wmsPackingListRefNo = wmsPackingListRefNo;
        this.manufacturingOrderNumber = manufacturingOrderNumber;
        this.styleNumber = styleNumber;
        this.itemNo = itemNo;
        this.description = description;
        this.color = color;
        this.lotNo = lotNo;
        this.rollNo = rollNo;
        this.qty = qty;
        this.uom = uom;
        this.grnStatus = grnStatus;
        this.objectType = objectType;
        this.palletCode = palletCode;
        this.palletState = palletState;
        this.palletAssignedLocation = palletAssignedLocation;
        this.palletConfirmedLocation = palletConfirmedLocation;
        this.grnRollDateConfirmed = grnRollDateConfirmed;
        this.balanceQty = balanceQty;
        this.issuedQty = issuedQty;
        this.barcodeNumber = barcodeNumber;
        this.issuedDate = issuedDate;
        this.inputWidth = inputWidth;
        this.inputWidthUom = inputWidthUom;
        this.inputWidthCm = inputWidthCm;
        this.actGrnDate = actGrnDate;
        this.actIssueDate = actIssueDate;
        this.allocatedQty = allocatedQty;
        this.consumedQty = consumedQty;
        this.relaxedWidth = relaxedWidth;
        this.relaxedDateTime = relaxedDateTime;
        this.relaxedDate = relaxedDate;
        this.shade= shade;
        this.remark = remark;

    }
}