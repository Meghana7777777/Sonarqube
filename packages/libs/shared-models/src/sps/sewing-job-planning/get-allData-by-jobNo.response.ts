import { GlobalResponseObject } from "../../common";
import { AllModulesModelForJobPriority, GetModuleByJobNoModel, GetModuleDetailsByModuleCodeModel, GetSectionDetailsBySectionCodeModel } from "./get-allData-by-jobNo.model";


export class GetModuleByJobNoResponse extends GlobalResponseObject {
  data: GetModuleByJobNoModel;

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data: GetModuleByJobNoModel,
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}

export class GetModuleDetailsByModuleCodeResponse extends GlobalResponseObject {
  data: GetModuleDetailsByModuleCodeModel;

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data: GetModuleDetailsByModuleCodeModel,
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
} 

export class GetSectionDetailsBySectionCodeResponse extends GlobalResponseObject {
  data: GetSectionDetailsBySectionCodeModel;

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data: GetSectionDetailsBySectionCodeModel,
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}

export class AllModulesResponseForJobPriority extends GlobalResponseObject {
  data: AllModulesModelForJobPriority[];
  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data: AllModulesModelForJobPriority[],
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}


