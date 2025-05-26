import { FeatureEnum, ReportingLevelsEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "packages/services/packing-management/src/database/common-entities";
import { Column, Entity, Unique } from "typeorm";


@Entity('pkms_m_reporting_configurations')
@Unique(['companyCode','unitCode','feature'])
export class PkmsReportingConfigurationEntity extends AbstractEntity{

     @Column({
        name: "feature",
        type: "enum",
        enum: FeatureEnum,
        nullable: false,
      })
      feature: FeatureEnum;

      @Column({
        name: "reporting_levels",
        type: "enum",
        enum: ReportingLevelsEnum,
        nullable: false,
      })
      reportingLevels: ReportingLevelsEnum;

      @Column({
        name: "is_external",
        type: "boolean",
        nullable: false,
        default: false
      })
      isExternal: boolean



}


