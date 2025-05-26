export class SJobLineOperationsModel {
    jobNo: string;
    operationCode: string;
    originalQty: number;
    inputQty: number;
    goodQty: number;
    rejectionQty: number;
    openRejections: number;
    sJobLineId: string;

    constructor(
        jobNo: string,
        operationCode: string,
        originalQty: number,
        inputQty: number,
        goodQty: number,
        rejectionQty: number,
        openRejections: number,
        sJobLineId: string,
    ) {
        this.jobNo = jobNo;
        this.operationCode = operationCode;
        this.originalQty = originalQty;
        this.inputQty = inputQty;
        this.goodQty = goodQty;
        this.rejectionQty = rejectionQty;
        this.openRejections = openRejections;
        this.sJobLineId = sJobLineId;
    }
}
