export class SewingJobSizeWiseSummaryModel {
sewingOrderId: number; // Unique ID for the sewing order
    sewingOrderName: string; // Name of the sewing order
    orderNo: string; // Order number
    sewingOrderSerial: number; // Serial number of the sewing order
    sewingOrderLineInfo: SewingJobLineInfo[]; // Array of sewing order line information
 
    constructor(
        sewingOrderId: number,
        sewingOrderName: string,
        orderNo: string,
        sewingOrderSerial: number,
        sewingOrderLineInfo: SewingJobLineInfo[]
    ) {
        this.sewingOrderId = sewingOrderId;
        this.sewingOrderName = sewingOrderName;
        this.orderNo = orderNo;
        this.sewingOrderSerial = sewingOrderSerial;
        this.sewingOrderLineInfo = sewingOrderLineInfo;
    }
}

export class SewingJobLineInfo {
    sewingOrderLineId: number;
    orderLineNo: string;
    productType: string;
    productName: string;
    fgColor: string; // Finished goods color (e.g., Red, Blue)
    sizeQtyDetails: SummaryQtyDetails[]; // Array of size and quantity details for the order line

    constructor(
        sewingOrderLineId: number,
        orderLineNo: string,
        productType: string,
        productName: string,
        fgColor: string,
        sizeQtyDetails: SummaryQtyDetails[]
    ) {
        this.sewingOrderLineId = sewingOrderLineId;
        this.orderLineNo = orderLineNo;
        this.productType = productType;
        this.productName = productName;
        this.fgColor = fgColor;
        this.sizeQtyDetails = sizeQtyDetails;
    }
}

export class SummaryQtyDetails {
    size: string; // Size of the product
    originalQty: number; // Original quantity
    sewGeneratedQty: number; // Quantity generated in sewing
    pendingQty: number; // Pending quantity
    inputReportedQty: number;
    completionQty: number;

    constructor( size: string, originalQty: number, sewGeneratedQty: number, pendingQty: number, inputReportedQty: number, completionQty: number ) {
        this.size = size;
        this.originalQty = originalQty;
        this.sewGeneratedQty = sewGeneratedQty;
        this.pendingQty = pendingQty;
        this.inputReportedQty = inputReportedQty;
        this.completionQty = completionQty;
    }
}