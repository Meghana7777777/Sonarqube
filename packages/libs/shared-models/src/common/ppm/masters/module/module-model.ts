import { ProcessTypeEnum } from "packages/libs/shared-models/src/oms";
import { CommonRequestAttrs } from "../../../common-request-attr.model";

export class ModuleModel  {
    id?: number;
    moduleCode: string;
    moduleName: string;
    moduleDesc: string;
    moduleType: ProcessTypeEnum;
    // wsCategory:WsCategoryEnum;
    moduleExtRef: string;
    moduleCapacity: string;
    maxInputJobs: string;
    maxDisplayJobs: string;
    moduleHeadName: string;
    moduleHeadCount: string;
    moduleOrder: string;
    moduleColor: string;
    secCode: string;
    isActive: boolean;

    constructor(
       
        id: number,
        moduleCode: string,
        moduleName: string,
        moduleDesc: string,
        moduleType: ProcessTypeEnum,
        // wsCategory:WsCategoryEnum,
        moduleExtRef: string,
        moduleCapacity: string,
        maxInputJobs: string,
        maxDisplayJobs: string,
        moduleHeadName: string,
        moduleHeadCount: string,
        moduleOrder: string,
        moduleColor: string,
        secCode: string,
        isActive: boolean,


    ) {
        this.id = id;
        this.moduleCode = moduleCode;
        this.moduleName = moduleName;
        this.moduleDesc = moduleDesc;
        this.moduleType = moduleType;
        // this.wsCategory = wsCategory;
        this.moduleExtRef = moduleExtRef;
        this.moduleCapacity = moduleCapacity;
        this.maxInputJobs = maxInputJobs;
        this.maxDisplayJobs = maxDisplayJobs;
        this.moduleHeadName = moduleHeadName;
        this.moduleHeadCount = moduleHeadCount;
        this.moduleOrder = moduleOrder;
        this.moduleColor = moduleColor;
        this.secCode = secCode;
        this.isActive = isActive

    }
}


