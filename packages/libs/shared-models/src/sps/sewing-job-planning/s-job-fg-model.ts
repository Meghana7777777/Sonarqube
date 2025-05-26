export class SJobFgModel {
    jobNo: string;
    sewFgNumbers: string;
    fgColors: string;
    productName: string;
    sizes: string;
    quantity: number;
  
    constructor(
      jobNo: string,
      sewFgNumbers: string,
      fgColors: string,
      productName: string,
      sizes: string,
      quantity: number
    ) {
      this.jobNo = jobNo;
      this.sewFgNumbers = sewFgNumbers;
      this.fgColors = fgColors;
      this.productName = productName;
      this.sizes = sizes;
      this.quantity = quantity;
    }
  }