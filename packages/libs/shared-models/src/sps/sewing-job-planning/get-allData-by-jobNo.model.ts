export class GetModuleByJobNoModel {
    jobNo: string;
    moduleNo:string
   
  
    constructor(
      jobNo: string,
      moduleNo:string
    ) {
      this.jobNo = jobNo;
      this.moduleNo = moduleNo
    }
  }

  export class GetModuleDetailsByModuleCodeModel {
    moduleCode:string;
    moduleName:string;
    moduleHeadName:string
    secCode:string
    constructor (
      moduleCode:string,
      moduleName:string,
      moduleHeadName:string,
      secCode:string
    ) {
      this.moduleCode = moduleCode;
      this.moduleName = moduleName;
      this.moduleHeadName = moduleHeadName;
      this.secCode = secCode
    }
  }

  export class GetSectionDetailsBySectionCodeModel {
    secCode:string;
    secName:string;
    secHeadName:string

    constructor (
      secCode:string,
      secName:string,
      secHeadName:string
    ) {
      this.secCode = secCode;
      this.secName = secName;
      this.secHeadName = secHeadName
    }
  }

  export class AllModulesModelForJobPriority {
    moduleCode: string;
    moduleName: string;
    constructor(moduleCode: string, moduleName: string) {
      this.moduleCode = moduleCode;
      this.moduleName = moduleName;
    }
  }