import { ProcessTypeEnum } from "../../oms";
import { TrimStatusEnum } from "../enum";

export class TrimsIssuedDashboardModel {
  sectionId: number;
  sectionCode: string;
  sectionColor: string;
  sectionType: ProcessTypeEnum;
  modules: TrimsissuedModuleModel[];
  constructor(
    sectionId: number,
    sectionCode: string,
    sectionColor: string,
    sectionType: ProcessTypeEnum,
    modules: TrimsissuedModuleModel[],
  ) {
    this.sectionId = sectionId;
    this.sectionCode = sectionCode;
    this.sectionColor = sectionColor;
    this.sectionType = sectionType;
    this.modules = modules;
  }
}

export class TrimsissuedModuleModel {
  moduleId: number;
  moduleCode: string;
  moduleColor: string;
  jobs: TrimsIssuedJobModel[];

  constructor(
    moduleId: number,
    moduleCode: string,
    moduleColor: string,
    jobs: TrimsIssuedJobModel[],
  ) {
    this.moduleId = moduleId;
    this.moduleCode = moduleCode;
    this.moduleColor = moduleColor;
    this.jobs = jobs;
  }
}

export class TrimsIssuedJobModel {
  jobNo: string;
  mOrderNo: string;
  mLineOrderNo: string;
  productName: string;
  productType: string;
  status: TrimStatusEnum;
  sewSerial: number;
  constructor(
    jobNo: string,
    mOrderNo: string,
    mLineorderNo: string,
    productName: string,
    productType: string,
    status: TrimStatusEnum,
    sewSerial: number
  ) {
    this.jobNo = jobNo;
    this.mOrderNo = mOrderNo;
    this.mLineOrderNo = mLineorderNo;
    this.productName = productName;
    this.productType = productType;
    this.status = status;
    this.sewSerial = sewSerial;
  }
}

export class TrimGroupWiseDetailsModel {
  trimGroupId: number;
  trimGroup: string;
  trimItemDetails: TrimIssuedDetailsModel[];
  constructor(
    trimGroup: string,
    trimItemDetails: TrimIssuedDetailsModel[],
  ) {
    this.trimGroup = trimGroup;
    this.trimItemDetails = trimItemDetails;
  }
}

export class TrimIssuedDetailsModel {
  trimGroupId: number;
  trimItemId: number;
  jobNo: string;
  status: TrimStatusEnum;
  itemCode: string;
  totalQuantity: number;
  issuedQuantity: number;
  uom: string;
  consumption: number;
  constructor(
    jobNo: string,
    status: TrimStatusEnum,
    itemCode: string,
    totalQuantity: number,
    issuedQuantity: number,
    trimGroupId: number,
    trimItemId: number,
    uom: string,
    consumption: number,
  ) {
    this.jobNo = jobNo;
    this.status = status;
    this.itemCode = itemCode;
    this.totalQuantity = totalQuantity;
    this.issuedQuantity = issuedQuantity;
    this.trimGroupId = trimGroupId;
    this.trimItemId = trimItemId;
    this.uom = uom;
    this.consumption = consumption;
  }
}
export class TrimsGroupsModel {
  id: number;
  jobNo: string;
  trimGroup: string;
  status: string;
  sJobLineId: number;

  constructor(
    id: number,
    jobNo: string,
    trimGroup: string,
    status: string,
    sJobLineId: number,
  ) {
    this.id = id;
    this.jobNo = jobNo;
    this.trimGroup = trimGroup;
    this.status = status;
    this.sJobLineId = sJobLineId
  }
}

export class TrimsItemsModel {
  id: number;
  jobNo: string;
  trimGroup: string;
  sJobTrimGroupId: number;
  itemCode: string;
  totalQuantity: number;
  issuedQuantity: number;
  consumption: number;
  uom: string;
  status: string;
  sJobLineId: number;
  remarks: string;

  constructor(
    id: number,
    jobNo: string,
    trimGroup: string,
    sJobTrimGroupId: number,
    totalQuantity: number,
    issuedQuantity: number,
    consumption: number,
    itemCode: string,
    uom: string,
    status: string,
    sJobLineId: number,
    remarks: string,
  ) {
    this.id = id;
    this.jobNo = jobNo;
    this.trimGroup = trimGroup;
    this.status = status;
    this.sJobLineId = sJobLineId;
    this.itemCode = itemCode;
    this.sJobTrimGroupId = sJobTrimGroupId;
    this.totalQuantity = totalQuantity;
    this.issuedQuantity = issuedQuantity;
    this.consumption = consumption;
    this.uom = uom;
    this.remarks = remarks
  }
}
