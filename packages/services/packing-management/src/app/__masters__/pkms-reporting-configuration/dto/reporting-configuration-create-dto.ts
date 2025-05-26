import { ApiProperty } from "@nestjs/swagger";
import { FeatureEnum, ReportingLevelsEnum } from "@xpparel/shared-models";
import { CommonDto } from "packages/services/packing-management/src/base-services/dtos/common-dto";

export class ReportingConfigurationCreateDto extends CommonDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    feature: FeatureEnum;

    @ApiProperty()
    reportingLevels: ReportingLevelsEnum;

    @ApiProperty()
    isExternal: boolean;//only for carton reporting
    
}