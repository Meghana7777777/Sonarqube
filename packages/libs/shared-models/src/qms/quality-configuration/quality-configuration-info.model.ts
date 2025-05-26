import { ProcessTypeEnum } from "../../oms";
import { QualityEsclationsConfigModel } from "./quality-configuration-creation.request";

export class QualityConfigurationInfoModel { 
    qualityType : string;
    qualityTypeId : number;
    styleCode : string;
    processType : ProcessTypeEnum;
    qualityPercentage : number;
    isMandatory : boolean;
    qualityConfigId : number;
    qualityEsclationsConfig : QualityEsclationsConfigModel[];

    constructor(qualityType : string, qualityTypeId : number, styleCode : string, processType : ProcessTypeEnum, qualityPercentage : number, isMandatory : boolean, qualityConfigId : number, qualityEsclationsConfig : QualityEsclationsConfigModel[]) {
        this.qualityType = qualityType;
        this.qualityTypeId = qualityTypeId;
        this.styleCode = styleCode;
        this.processType = processType;
        this.qualityPercentage = qualityPercentage;
        this.isMandatory = isMandatory;
        this.qualityConfigId = qualityConfigId;
        this.qualityEsclationsConfig = qualityEsclationsConfig;
    }
}