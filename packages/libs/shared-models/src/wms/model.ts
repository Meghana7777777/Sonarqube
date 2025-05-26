// packing list creation against to supplier purchase order
// 1. Packing list summary
// Request
export class SupplierPoReq {
    supplierPo: string;
    unitCode: string;
    companyCode: string;
}
// Packing list summary Response 
export class PackingListSummaryResp {
    supplierPo: string;
    supplierName: string;
    supplierCode: string;
    supplierPoQty: number; // overall supplier po quantity - 200Yards
    noOfPackLists: number; // number of packing lists created so far // 5  
    grnCompletedPackLists: number; // number of packilists grn has been completed so far // 2
    packingListCreatedQty: number; // packing list created quantity so far // 5*20 
    grnQty: number; // GRN quantity // 2 * 20 
    remainingQty: number; //  OVERALL SUPPLIER PO QUANTITY - PACKING LIST CREATED QTY
    unitCode: string;
    companyCode: string;
}
// 2. New packing list creation
// request & Response as well 
export class PackingListInfoModel {
    supplierPo: string;
    deliveryDate: string;
    packingBatchInfo: [{
        deliveryDate: string;
        batchNumber: string;
        invoiceNumber: string;
        invoiceDate: string;
        remarks: string;
        lotInfo: [{
            lotNumber: string;
            materialItemCode: string;
            itemType: string;
            itemCategory: string;
            remarks: string;
            rollInfo: [
                {
                    rollNumber: number;
                    externalRollNumber: number;
                    objectType: string;
                    quantity: number;
                    uom: string;
                    width: number;
                    length: number;
                    shade: string;
                    sk_length: number;
                    sk_width: number;
                    sk_group: number;
                    weight: number;
                    gsm: number;
                    preferredUom: string;
                    remarks: string;
                }
            ]
        }]

    }];
    phLogDetails?: {
        fileUrl: string;
    }
    userName: string;
    unitCode: string;
    companyCode: string;
}