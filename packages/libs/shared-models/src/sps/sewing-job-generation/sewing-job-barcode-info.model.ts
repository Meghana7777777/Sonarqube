export class BarcodeDetails {
    barcode: string;  // Barcode identifier
    plantStyleRef: string;  // Reference of the style in the plant
    jobNo: number;  // Job number associated with the barcode
    bundleNo: number;  // Bundle number associated with the job
    color: string;  // Color of the product
    size: string;  // Size of the product
    qty: number;  // Quantity of the items
    moNo: string;  // Manufacturing order number
    moLines: number[];  // Array of manufacturing order line numbers
    opCode: number;  // Operation code for the job
    garmentPO: string;  // Garment purchase order number
    jobGroup: string;  // Group associated with the job
    planProdDate: string;

    constructor(
        barcode: string,
        plantStyleRef: string,
        jobNo: number,
        bundleNo: number,
        color: string,
        size: string,
        qty: number,
        moNo: string,
        moLines: number[],
        opCode: number,
        garmentPO: string,
        jobGroup: string,
        planProdDate: string
    ) {
        this.barcode = barcode;
        this.plantStyleRef = plantStyleRef;
        this.jobNo = jobNo;
        this.bundleNo = bundleNo;
        this.color = color;
        this.size = size;
        this.qty = qty;
        this.moNo = moNo;
        this.moLines = moLines;
        this.opCode = opCode;
        this.garmentPO = garmentPO;
        this.jobGroup = jobGroup;
        this.planProdDate = planProdDate
    }
}

export class JobDetailModel {
    jobNo: string;
    jobType: string;
  
    constructor(jobNo: string, jobType: string) {
      this.jobNo = jobNo;
      this.jobType = jobType;
    }
  }
  
