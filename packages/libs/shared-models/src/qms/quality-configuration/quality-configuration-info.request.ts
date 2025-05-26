import { CommonRequestAttrs } from "../../common";

export class QualityConfigurationInfoRequest extends CommonRequestAttrs {
    qualityConfigId?: number;
    iNeedQualityEsclations: boolean;
    iNeedQualityChecklist: boolean;

    /**
     * 
     * @param username 
     * @param unitCode 
     * @param companyCode 
     * @param userId 
     * @param id 
     * @param iNeedQualityEsclations 
     * @param iNeedQualityChecklist 
     */

    constructor(username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        iNeedQualityEsclations: boolean,
        iNeedQualityChecklist: boolean,
        qualityConfigId?: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.qualityConfigId = qualityConfigId;
        this.iNeedQualityEsclations = iNeedQualityEsclations;
        this.iNeedQualityChecklist = iNeedQualityChecklist;
    }
    
}