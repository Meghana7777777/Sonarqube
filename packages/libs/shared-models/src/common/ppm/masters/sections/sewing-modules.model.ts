import { SJobLineOperationsModel } from "packages/libs/shared-models/src/sps";
import { ProcessTypeEnum } from "packages/libs/shared-models/src/oms";
import { GlobalResponseObject } from "../../../global-response-object";

export class SewingModulesModel {
  sectionCode: string;
  sectionType: ProcessTypeEnum;
  moduleDetails: SewingModuleDetails[];

  constructor(sectionCode: string, sectionType: ProcessTypeEnum, moduleDetails: SewingModuleDetails[]) {
    this.sectionCode = sectionCode;
    this.sectionType = sectionType;
    this.moduleDetails = moduleDetails;
  }
}

export class SewingModuleDetails {
  moduleId: string;
  moduleName: string;
  moduleType: ProcessTypeEnum;
  wsInModule: number;
  wsDownTimeInModule: number;
  moduleEfficiency: number;
  moduleColor: string;
  moduleForecastActualMins: number;
  moduleAlreadyPlannedMins: number;
  // availableMins: number;
  utilizationPercentage: number;
  inprogressJobDetails: InProgressJobDetails[]
  planDateWiseData?: DateWiseJobs[]
  constructor(
    moduleId: string,
    moduleName: string,
    moduleType: ProcessTypeEnum,
    wsInModule: number,
    wsDownTimeInModule: number,
    moduleEfficiency: number,
    moduleColor: string,
    moduleForecastActualMins: number,
    moduleAlreadyPlannedMins: number,
    // availableMins: number,
    utilizationPercentage: number,
    inprogressJobDetails: InProgressJobDetails[],
    planDateWiseData?: DateWiseJobs[]
  ) {
    this.moduleId = moduleId;
    this.moduleName = moduleName;
    this.moduleType = moduleType;
    this.wsInModule = wsInModule;
    this.wsDownTimeInModule = wsDownTimeInModule;
    this.moduleEfficiency = moduleEfficiency;
    this.moduleColor = moduleColor;
    this.moduleForecastActualMins = moduleForecastActualMins;
    this.moduleAlreadyPlannedMins = moduleAlreadyPlannedMins;
    // this.availableMins = availableMins;
    this.utilizationPercentage = utilizationPercentage;
    this.inprogressJobDetails = inprogressJobDetails;
    this.planDateWiseData = planDateWiseData;
  }
}

export class InProgressJobDetails {
  // sewingOrderLineNo: string;
  productName: string;
  productType: string;
  plantStyle: string;
  jobNo: string;
  jobType: string;
  planInputDate: string;
  planProductiondate: string;
  operationsdetails: SJobLineOperationsModel[];

  constructor(sewingOrderLineNo: string,
    productName: string,
    productType: string,
    plantStyle: string, jobNo: string, jobType: string, planInputDate: string, planProductiondate: string, operationsdetails: SJobLineOperationsModel[]) {
    // this.sewingOrderLineNo = sewingOrderLineNo;
    this.productName = productName;
    this.productType = productType;
    this.plantStyle = plantStyle;
    this.jobNo = jobNo;
    this.jobType = jobType;
    this.planInputDate = planInputDate;
    this.planProductiondate = planProductiondate;
    this.operationsdetails = operationsdetails;
  }
}


export class DateWiseJobs {
  date: string;
  datesWithJobs: InProgressJobDetails[]
  constructor(
    date: string,
    datesWithJobs: InProgressJobDetails[]
  ) {
    this.date = date
    this.datesWithJobs = datesWithJobs
  }

}

export class ActualPlannedMinutesResponse extends GlobalResponseObject {
  data: ForecastDataModel[]
  constructor(status: boolean, errorCode: number, internalMessage: string, data: ForecastDataModel[]) {
    super(status, errorCode, internalMessage)
    this.data = data
  }
}
export class ForecastDataModel {
  locationCode: string;
  smv: number;
  planPcs: number;
  constructor(locationCode: string, smv: number, planPcs: number) {
    this.locationCode = locationCode;
    this.smv = smv;
    this.planPcs = planPcs;
  }
}

export class SewingJobInProgressData {
  jobType: string;
  planInputDate: Date;
  jobNo: string;
}

export interface SectionViewModel {
  sectionId: number;
  sectionCode: string;
  sectionName: string;
  sectionColor: string;
  secType: ProcessTypeEnum
}

export class ModuleLogisticsDetailsModel {
  forecastActualMins: number;
  alreadyPlannedMins: number;
  availableMins: number;
  utilizationPercentage: number;

  constructor(
    forecastActualMins: number,
    alreadyPlannedMins: number,
    availableMins: number,
    utilizationPercentage: number
  ) {
    this.forecastActualMins = forecastActualMins;
    this.alreadyPlannedMins = alreadyPlannedMins;
    this.availableMins = availableMins;
    this.utilizationPercentage = utilizationPercentage;
  }
}

export class ModuleDropdownModel {
  jobNo: string;
  moduleNo: string;

  constructor(jobNo: string, moduleNo: string) {
    this.jobNo = jobNo;
    this.moduleNo = moduleNo;
  }
}



