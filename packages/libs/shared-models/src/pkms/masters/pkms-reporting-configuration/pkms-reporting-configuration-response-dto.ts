import { ReportingLevelsEnum } from "../../enum";

export class PkmsReportingConfigurationResponseDto {
    id: number;
    feature: ReportingLevelsEnum;
    isExternal: boolean;
    constructor(
        id: number,
        feature: ReportingLevelsEnum,
        isExternal: boolean
    ) {
        this.id = id;
        this.feature = feature;
        this.isExternal = isExternal;
    }

}