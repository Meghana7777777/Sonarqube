import { CommonRequestAttrs } from "../../../common";
import { FeatureEnum, ReportingLevelsEnum } from "../../enum";

export class PkmsReportingConfigurationRequestModel extends CommonRequestAttrs {
    id: number;
    feature: FeatureEnum;
    // reportingLevels: ReportingLevelsEnum;
    constructor(
        feature: FeatureEnum,
        // reportingLevels: ReportingLevelsEnum,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id?: number,
    ) {
        super(username, unitCode, companyCode, userId)
        this.id = id;
        this.feature = feature;
        // this.reportingLevels = reportingLevels;
    }
}