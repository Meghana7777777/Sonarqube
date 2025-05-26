import { ProcessTypeEnum } from "../../oms";
import { TrimStatusEnum } from "../enum";

export class InputPlanningDashboardModel {
  sectionId: number;
  sectionCode: string;
  sectionColor: string;
  sectionType: ProcessTypeEnum;
  modules: IPlannningModuleModel[];
  sectionMetrics: SectionMetrics;
  plantIssue: boolean; //efficiency less than 70%

  constructor(
    sectionId: number,
    sectionCode: string,
    sectionColor: string,
    sectionType: ProcessTypeEnum,
    modules: IPlannningModuleModel[],
    sectionMetrics: SectionMetrics,
    plantIssue: boolean
  ) {
    this.sectionId = sectionId;
    this.sectionCode = sectionCode;
    this.sectionColor = sectionColor;
    this.sectionType = sectionType;
    this.modules = modules;
    this.sectionMetrics = sectionMetrics;
    this.plantIssue = plantIssue;
  }
}

export class SectionMetrics {
  totalPlannedWork: string; // forecast plan
  totalActualWorkDone: string;
  overallEfficiencyPercentage: string;

  constructor(
    totalPlannedWork: string,
    totalActualWorkDone: string,
    overallEfficiencyPercentage: string
  ) {
    this.totalPlannedWork = totalPlannedWork;
    this.totalActualWorkDone = totalActualWorkDone;
    this.overallEfficiencyPercentage = overallEfficiencyPercentage;
  }
}

export class IPlannningModuleModel {
  moduleId: number;
  moduleCode: string;
  moduleColor: string;
  jobs: IPlannningJobModel[];
  downtimeDetails: ModuleDowntimeDataModel;
  moduleMetrics: ModuleMetrics;
  totalWorkInProgressQty : number;

  constructor(
    moduleId: number,
    moduleCode: string,
    moduleColor: string,
    jobs: IPlannningJobModel[],
    downtimeDetails: ModuleDowntimeDataModel,
    moduleMetrics: ModuleMetrics,
    totalWorkInProgressQty: number,
    plantIssue?: boolean,
  ) {
    this.moduleId = moduleId;
    this.moduleCode = moduleCode;
    this.moduleColor = moduleColor;
    this.jobs = jobs;
    this.downtimeDetails = downtimeDetails;
    this.moduleMetrics = moduleMetrics;
    this.totalWorkInProgressQty = totalWorkInProgressQty;
  }
}

export class IPlannningJobModel {
  sewSerial: number;
  jobNo: string;
  status: jobStatusTypeModel;
  mOrderNo: string;
  sLineOrderNo: string;
  productName: string;
  productType: string;
  coLine: string;
  cutJobdetails?: CurJobDetailsModel;
  isRejected: boolean;
  jobCompletionPercentage: number;
  workInProgress: number;
  constructor(
    sewSerial: number,
    jobNo: string,
    status: jobStatusTypeModel,
    mOrderNo: string,
    sLineorderNo: string,
    productName: string,
    productType: string,
    cutJobdetails: CurJobDetailsModel,
    isRejected: boolean,
    jobCompletionPercentage: number,
    workInProgress: number
  ) {
    this.sewSerial = sewSerial;
    this.jobNo = jobNo;
    this.status = status;
    this.mOrderNo = mOrderNo;
    this.sLineOrderNo = sLineorderNo;
    this.productName = productName;
    this.productType = productType;
    // this.operationalTrackInfo = operationalTrackInfo;
    this.cutJobdetails = cutJobdetails;
    // this.trimDetails = trimDetails;
    this.isRejected = isRejected;
    this.jobCompletionPercentage = jobCompletionPercentage;
    this.workInProgress = workInProgress;
  }
}

export class SJobLineOperationsModel {
  jobNo: string;
  operationCode: string;
  originalQty: number;
  inputQty: number;
  goodQty: number;
  rejectionQty: number;
  openRejections: number;
  sJobLineId: string;
  smv: number;

  constructor(
    jobNo: string,
    operationCode: string,
    originalQty: number,
    inputQty: number,
    goodQty: number,
    rejectionQty: number,
    openRejections: number,
    sJobLineId: string,
    smv: number
  ) {
    this.jobNo = jobNo;
    this.operationCode = operationCode;
    this.originalQty = originalQty;
    this.inputQty = inputQty;
    this.goodQty = goodQty;
    this.rejectionQty = rejectionQty;
    this.openRejections = openRejections;
    this.sJobLineId = sJobLineId;
    this.smv = smv;
  }
}


export class CurJobDetailsModel {

}

export class TrimDetailsModel {
  jobNo: string;
  status: TrimStatusEnum;
  itemCode: string;
  totalQuantity: number;
  issuedQuantity: number;
  constructor(
    jobNo: string,
    status: TrimStatusEnum,
    itemCode: string,
    totalQuantity: number,
    issuedQuantity: number,
  ) {
    this.jobNo = jobNo;
    this.status = status;
    this.itemCode = itemCode;
    this.totalQuantity = totalQuantity;
    this.issuedQuantity = issuedQuantity;
  }
}

export class TrimGroupsModel {
  jobNo: string;
  status: string;
  trimGroup: string;
  issuedStatus: string;
  constructor(
    jobNo: string,
    status: string,
    trimGroup: string,
    issuedStatus: string,
    trimGroups: TrimGroupsModel[]
  ) {
    this.jobNo = jobNo;
    this.status = status;
    this.trimGroup = trimGroup;
    this.issuedStatus = issuedStatus;
  }
}

export class ModuleMetrics {
  totalPlannedWork: string;
  totalActualWorkDone: string;
  overallEfficiencyPercentage: string;

  constructor(
    totalPlannedWork: string,
    totalActualWorkDone: string,
    overallEfficiencyPercentage: string
  ) {
    this.totalPlannedWork = totalPlannedWork;
    this.totalActualWorkDone = totalActualWorkDone;
    this.overallEfficiencyPercentage = overallEfficiencyPercentage;
  }
}

export class ModuleDowntimeDataModel {
  downTimeStatus: boolean;
  downtimeReasons: string
  downtimeImpactOnWork?: string;

  constructor(
    downTimeStatus: boolean,
    downtimeReasons: string,
    downtimeImpactOnWork?: string
  ) {
    this.downTimeStatus = downTimeStatus;
    this.downtimeReasons = downtimeReasons;
    this.downtimeImpactOnWork = downtimeImpactOnWork;
  }
}

export class OperationalTrackInfo {
  operationCode: string;
  totalOperations: number;
  completedOperations: number;
  openRejections: number;

  constructor(
    operationCode: string,
    totalOperations: number,
    completedOperations: number,
    openRejections: number
  ) {
    this.operationCode = operationCode;
    this.totalOperations = totalOperations;
    this.completedOperations = completedOperations;
    this.openRejections = openRejections;
  }
}

export class JobStatusModel {
  inputQuantity: number;
  goodQuantity: number;
  rejectionQuantity: number;
  cutJobQuantity: number;
  pendingCutQty: number;
  statusType: jobStatusTypeModel;
  constructor(
    inputQuantity: number,
    goodQuantity: number,
    rejectionQuantity: number,
    cutJobQuantity: number,
    pendingCutQty: number,
    statusType: jobStatusTypeModel,
  ) {
    this.inputQuantity = inputQuantity;
    this.goodQuantity = goodQuantity;
    this.rejectionQuantity = rejectionQuantity;
    this.cutJobQuantity = cutJobQuantity;
    this.pendingCutQty = pendingCutQty;
    this.statusType = statusType;
  }
}

export class jobStatusTypeModel {
  status: string;
  shape: string;
  color: string;
  constructor(status: string,
    shape: string,
    color: string,) {
    this.status = status;
    this.shape = shape;
    this.color = color;
  }
}

export class SequencedIJobOperationModel {
  processingSerial: number;
  processType: string;
  jobNo: string;
  operationGroup: string;
  operationCode: string;
  operationCodes: string;
  originalQty: number;
  inputQty: number;
  goodQty: number;
  rejectionQty: number;
  openRejections: number;
  operationSequence: number;
  smv: number;
  jobCompletionPercentage: number;
  workInProgress: number;

  constructor(
    processingSerial: number,
    processType: string,
    jobNo: string,
    operationGroup: string,
    operationCode: string,
    operationCodes: string,
    originalQty: number,
    inputQty: number,
    goodQty: number,
    rejectionQty: number,
    openRejections: number,
    operationSequence: number,
    smv: number,
    // jobCompletionPercentage: number,
    // workInProgress: number
  ) {
    this.processingSerial = processingSerial;
    this.processType = processType;
    this.jobNo = jobNo;
    this.operationGroup = operationGroup;
    this.operationCode = operationCode;
    this.operationCodes = operationCodes;
    this.originalQty = originalQty;
    this.inputQty = inputQty;
    this.goodQty = goodQty;
    this.rejectionQty = rejectionQty;
    this.openRejections = openRejections;
    this.operationSequence = operationSequence;
    this.smv = smv;
    // this.jobCompletionPercentage = jobCompletionPercentage;
    // this.workInProgress = workInProgress;
  }
}


export class JobWIPDataModel {
  jobCompletionPercentage: number;
  workInProgress: number;

  constructor(
    jobCompletionPercentage: number,
    workInProgress: number
  ) {
    this.jobCompletionPercentage = jobCompletionPercentage;
    this.workInProgress = workInProgress;
  }
}

export class BarcodeDetailsForQualityResultsModel {
  barcode: string;
  barcodeType: string;
  operationCode: string;
  processType: ProcessTypeEnum;
  failCount: number;
  resourceCode: string;
  companyCode: string;
  unitCode: string;
  createdUser: string;
  updatedUser: string;
  constructor(
    barcode: string,
    barcodeType: string,
    operationCode: string,
    processType: ProcessTypeEnum,
    failCount: number,
    resourceCode: string,
    companyCode: string,
    unitCode: string,
    createdUser: string,
    updatedUser: string
  ) {
    this.barcode = barcode;
    this.barcodeType = barcodeType;
    this.operationCode = operationCode;
    this.processType = processType;
    this.failCount = failCount;
    this.resourceCode = resourceCode;
    this.companyCode = companyCode;
    this.unitCode = unitCode;
    this.createdUser = createdUser;
    this.updatedUser = updatedUser;
  }
}

export class BarcodeQualityResultsModel {
  barcode: string;
  barcodeType: string;
  operationCode: string;
  processType: ProcessTypeEnum;
  failCount: number;
  resourceCode: string;
  constructor(
    barcode: string,
    barcodeType: string,
    operationCode: string,
    processType: ProcessTypeEnum,
    failCount: number,
    resourceCode: string,
  ) {
    this.barcode = barcode;
    this.barcodeType = barcodeType;
    this.operationCode = operationCode;
    this.processType = processType;
    this.failCount = failCount;
    this.resourceCode = resourceCode;
  }
}

export class IpsBarcodeQualityResultsModel {
  locationCode: string;
  barcode: string;
  barcodeType: string;
  operationCode: string;
  processType: ProcessTypeEnum;
  failCount: number;
  resourceCode: string;
  constructor(
    locationCode: string,
    barcode: string,
    barcodeType: string,
    operationCode: string,
    processType: ProcessTypeEnum,
    failCount: number,
    resourceCode: string,
  ) {
    this.locationCode = locationCode;
    this.barcode = barcode;
    this.barcodeType = barcodeType;
    this.operationCode = operationCode;
    this.processType = processType;
    this.failCount = failCount;
    this.resourceCode = resourceCode;
  }
}

export class TrimsItemsStatusModel {
  status: string;
  constructor(status: string) {
    this.status = status;
  }
}

export class IJobDetailsByJobNoModel {
  sewSerial: number;
  orderRefNo: string;
  orderLineRefNo: string;
  productName: string;
  productType: string;
  jobNo: string;
  rawMaterialStatus: string;

  constructor(
    sewSerial: number,
    orderRefNo: string,
    orderLineRefNo: string,
    productName: string,
    productType: string,
    jobNo: string,
    rawMaterialStatus: string
  ) {
    this.sewSerial = sewSerial;
    this.orderRefNo = orderRefNo;
    this.orderLineRefNo = orderLineRefNo;
    this.productName = productName;
    this.productType = productType;
    this.jobNo = jobNo;
    this.rawMaterialStatus = rawMaterialStatus;
  }
}

export class TrimsJobDetailModel {
  orderRefNo: string;
  orderLineRefNo: string;
  productName: string;
  productType: string;
  jobNo: string;

  constructor(
    orderRefNo: string,
    orderLineRefNo: string,
    productName: string,
    productType: string,
    jobNo: string
  ) {
    this.orderRefNo = orderRefNo;
    this.orderLineRefNo = orderLineRefNo;
    this.productName = productName;
    this.productType = productType;
    this.jobNo = jobNo;
  }
}

export class IpsDowntimeDetailsModel {
  locationCode: string;
  downtimeReason: string;
  startTime: Date;
  endTime: Date;
  downtimeInHours: number;
  constructor(locationCode: string, downtimeReason: string, startTime: Date, endTime: Date, downtimeInHours: number) {
    this.locationCode = locationCode;
    this.downtimeReason = downtimeReason;
    this.startTime = startTime;
    this.endTime = endTime;
    this.downtimeInHours = downtimeInHours;
  }
}

