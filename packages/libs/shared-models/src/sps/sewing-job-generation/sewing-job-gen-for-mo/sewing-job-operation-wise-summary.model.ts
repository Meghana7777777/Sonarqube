export class SewingJobOperationWiseSummaryModel {
    sewingOrderId: number; // Unique ID for the sewing order
        sewingOrderName: string; // Name of the sewing order
        orderNo: string; // Order number
        sewingOrderSerial: number; // Serial number of the sewing order
        sewingOrderLineInfo: SewingJobOperationLineInfo[]; // Array of sewing order line information
     
        constructor(
            sewingOrderId: number,
            sewingOrderName: string,
            orderNo: string,
            sewingOrderSerial: number,
            sewingOrderLineInfo: SewingJobOperationLineInfo[]
        ) {
            this.sewingOrderId = sewingOrderId;
            this.sewingOrderName = sewingOrderName;
            this.orderNo = orderNo;
            this.sewingOrderSerial = sewingOrderSerial;
            this.sewingOrderLineInfo = sewingOrderLineInfo;
        }
    }
    
    export class SewingJobOperationLineInfo {
        sewingOrderLineId: number;
        orderLineNo: string;
        productType: string;
        productName: string;
        fgColor: string; // Finished goods color (e.g., Red, Blue)
        sizeQtyDetails: SummaryOperationQtyDetails[]; // Array of size and quantity details for the order line
    
        constructor(
            sewingOrderLineId: number,
            orderLineNo: string,
            productType: string,
            productName: string,
            fgColor: string,
            sizeQtyDetails: SummaryOperationQtyDetails[]
        ) {
            this.sewingOrderLineId = sewingOrderLineId;
            this.orderLineNo = orderLineNo;
            this.productType = productType;
            this.productName = productName;
            this.fgColor = fgColor;
            this.sizeQtyDetails = sizeQtyDetails;
        }
    }
    
    export class SummaryOperationQtyDetails {
        operation: string; // Size of the product
        originalQty: number; // Original quantity
        sewGeneratedQty: number; // Quantity generated in sewing
        pendingQty: number; // Pending quantity
        inputReportedQty: number;
        completionQty: number;
        size: string;
    
        constructor( operation: string, originalQty: number, sewGeneratedQty: number, pendingQty: number, inputReportedQty: number, completionQty: number, size: string) {
            this.operation = operation;
            this.originalQty = originalQty;
            this.sewGeneratedQty = sewGeneratedQty;
            this.pendingQty = pendingQty;
            this.inputReportedQty = inputReportedQty;
            this.completionQty = completionQty;
            this.size = size;
        }
    }