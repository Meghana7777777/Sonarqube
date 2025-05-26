export class SewingJobPriorityModel {
    jobNo: string;
    jobPriority: number;
    deliveryDate: Date;
    productType: string;
    productName: string;
    constructor(jobNo: string, jobPriority: number, deliveryDate: Date, productType: string, productName: string,) {
        this.jobNo = jobNo;
        this.jobPriority = jobPriority;
        this.deliveryDate = deliveryDate;
        this.productName = productName;
        this.productType = productType;
    }
}