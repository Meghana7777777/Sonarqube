import { SJobLineOperationsModel } from "./s-job-line-operations.model";

export class SewingJobPendingDataModel {
    sewingOrderLineNo: string;
    productName: string;
    productType: string;
    plantStyle: string;
    jobNo: string;
    jobType: string;
    planProductionDate: string;
    jobDispatchDate?: string;
    operationsInJob: SJobLineOperationsModel[]

    constructor(sewingOrderLineNo: string,
        productName: string,
        productType: string,
        plantStyle: string, jobNo: string, jobType: string, operationsInJob: SJobLineOperationsModel[], planProductionDate: string, jobDispatchDate?: string ) {
        this.sewingOrderLineNo = sewingOrderLineNo;
        this.productName = productName;
        this.productType = productType;
        this.plantStyle = plantStyle;
        this.jobNo = jobNo;
        this.jobType = jobType;
        this.planProductionDate = planProductionDate;
        this.jobDispatchDate = jobDispatchDate;
        this.operationsInJob = operationsInJob;
    }
}

export class SewingJobInProgressModel {
    productName: string;
    productType: string;
    plantStyle: string;
    sewingOrderLineNo: string;
    planProductionDate: string;
    planInputDate: string;
    jobType: string;
    jobNo: string;
  
    constructor(
      productName: string,
      productType: string,
      plantStyle: string,
      sewingOrderLineNo: string,
      planProductionDate: string,
      planInputDate: string,
      jobType: string,
      jobNo: string
    ) {
      this.productName = productName;
      this.productType = productType;
      this.plantStyle = plantStyle;
      this.sewingOrderLineNo = sewingOrderLineNo;
      this.planProductionDate = planProductionDate;
      this.planInputDate = planInputDate;
      this.jobType = jobType;
      this.jobNo = jobNo;
    }
  }
  