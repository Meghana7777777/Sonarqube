import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum } from "../../oms";

export class QualityEsclationsConfigModel {
    name: string;
    quantity: number;
    responsibleUser: string;
    level: string;
    qualityConfigId: number;
    id?: number;

    /**
     * 
     * @param name 
     * @param quantity 
     * @param responsibleUser 
     * @param level 
     * @param qualityConfigId 
     */

    constructor(name: string, quantity: number, responsibleUser: string, level: string, qualityConfigId: number,id?: number) {
        this.qualityConfigId = qualityConfigId;
        this.name = name;
        this.quantity = quantity;
        this.responsibleUser = responsibleUser;
        this.level = level;
        this.id = id;
    }
}

export class QualityConfigurationCreationReq extends CommonRequestAttrs {
    qualityTypeId: number;
    styleCode: string;
    processType: ProcessTypeEnum;
    qualityPercentage: number;
    isMandatory: boolean;
    qualityEsclationsConfig?: QualityEsclationsConfigModel[];

    /**
     * 
     * @param username created username
     * @param unitCode 
     * @param companyCode 
     * @param userId 
     * @param qualityTypeId 
     * @param styleCode 
     * @param processType 
     * @param qualityPercentage 
     * @param isMandatory 
     * @param qualityEsclationsConfig 
     */

    constructor(username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        qualityTypeId: number,
        styleCode: string,
        processType: ProcessTypeEnum,
        qualityPercentage: number,
        isMandatory: boolean,
        qualityEsclationsConfig?: QualityEsclationsConfigModel[]) {
        super(username, unitCode, companyCode, userId);
        this.qualityTypeId = qualityTypeId;
        this.styleCode = styleCode;
        this.processType = processType;
        this.qualityPercentage = qualityPercentage;
        this.isMandatory = isMandatory;
        this.qualityEsclationsConfig = qualityEsclationsConfig;

    }
}