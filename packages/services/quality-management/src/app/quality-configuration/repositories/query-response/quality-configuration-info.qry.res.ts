import { ProcessTypeEnum } from "@xpparel/shared-models";

export class QualityConfigInfoQueryRes{
    styleCode: string;
    processType: ProcessTypeEnum; 
    qualityPercentage: number;
    isMandatory: boolean;
    qualityTypeId: number;
    qualityConfigId: number;
    qualityType: string;
}