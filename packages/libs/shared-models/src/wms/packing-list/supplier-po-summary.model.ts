import { CommonRequestAttrs } from "../../common";

export class SupplierPoSummaryModel extends CommonRequestAttrs{
    id: number;
    supplierName: string;
    supplierCode: string;
    supplierPoQty: number; // overall supplier po quantity - 200Yards
    noOfPackLists: number; // number of packing lists created so far // 5  
    grnCompletedPackLists: number; // number of packilists grn has been completed so far // 2
    packingListCreatedQty: number; // packing list created quantity so far // 5*20 
    grnQty: number; // GRN quantity // 2 * 20 
    remainingQty: number; //  OVERALL SUPPLIER PO QUANTITY - PACKING LIST CREATED QTY
    constructor( id: number,
        supplierName: string,
        supplierCode: string,
        supplierPoQty: number,
        noOfPackLists: number,
        grnCompletedPackLists: number,
        packingListCreatedQty: number,
        grnQty: number,
        remainingQty: number,username: string, unitCode: string, companyCode: string, userId: number
        ){
        super(username, unitCode, companyCode, userId)
        this.id = id;
        this.supplierName = supplierName;
        this.supplierCode = supplierCode;
        this.supplierPoQty = supplierPoQty;
        this.noOfPackLists = noOfPackLists;
        this.grnCompletedPackLists = grnCompletedPackLists;
        this.packingListCreatedQty = packingListCreatedQty;
        this.grnQty = grnQty;
        this.remainingQty = remainingQty;
    }
}