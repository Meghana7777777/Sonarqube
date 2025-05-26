import { ProcessTypeEnum } from "../../../oms";

export class SewingJobPropsModel {
    jobNumber: string;
    sewSerial: number;
    sewOrderDesc: string;
    moNumber: string;
    moLineNumbers: string;
    buyer: string;
    destination: string;
    planProductionDate: string;
    coLine: string;
    jobQty: number;
    noOfJobBundles: number;
    eligibleToReportQty: number;
    fgColors: string;
    productName: string;
    sizes: string;
    dependentJobsInfo: DependentJobGroupInfo[];
    inputReportedQty: number;
    pendingToInputQty: number;
    moduleNumber: string;
    outputReportedQty: number;
    wip: number;
    processingType: ProcessTypeEnum;
    style: string;
    rejectedQty: number;

    constructor(jobNumber: string, sewSerial: number, sewOrderDesc: string, moNumber: string, moLineNumbers: string, buyer: string, destination: string, planProductionDate: string, coLine: string, jobQty: number, noOfJobBundles: number, eligibleToReportQty: number, fgColors: string, productName: string, sizes: string, dependentJobsInfo: DependentJobGroupInfo[], inputReportedQty: number, pendingToInputQty: number,  outputReportedQty: number, wip: number, processingType: ProcessTypeEnum, style: string, rejectedQty: number) {
        this.jobNumber = jobNumber;
        this.sewOrderDesc = sewOrderDesc;
        this.sewSerial = sewSerial;
        this.moNumber = moNumber;
        this.moLineNumbers = moLineNumbers;
        this.buyer = buyer;
        this.destination = destination;
        this.planProductionDate = planProductionDate;
        this.coLine = coLine;
        this.jobQty = jobQty;
        this.noOfJobBundles = noOfJobBundles;
        this.eligibleToReportQty = eligibleToReportQty;
        this.fgColors = fgColors;
        this.productName = productName;
        this.sizes = sizes;
        this.dependentJobsInfo = dependentJobsInfo;
        this.inputReportedQty = inputReportedQty;
        this.pendingToInputQty = pendingToInputQty;
        this.outputReportedQty = outputReportedQty;
        this.wip = wip;
        this.processingType = processingType;
        this.style = style;
        this.rejectedQty = rejectedQty;
    }
}

export class DependentJobGroupInfo {
    depJobGroup : number | string;
    operationCategory: ProcessTypeEnum;
    dependentComp: string;
    eligibleToReportQty: number;
    requestedQty: number;
    issuedQty: number;
    constructor(depJobGroup : number | string, operationCategory: ProcessTypeEnum, dependentComp: string, eligibleToReportQty: number, requestedQty: number, issuedQty: number) {
        this.depJobGroup = depJobGroup;
        this.operationCategory = operationCategory;
        this.dependentComp = dependentComp;
        this.eligibleToReportQty = eligibleToReportQty;
        this.requestedQty = requestedQty;
        this.issuedQty = issuedQty;
    }
}