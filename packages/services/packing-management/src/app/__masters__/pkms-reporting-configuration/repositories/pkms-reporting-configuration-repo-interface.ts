import { BaseInterfaceRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PkmsReportingConfigurationEntity } from "../entites/pkms-reporting-configuration-entity";
import { CommonRequestAttrs } from "@xpparel/shared-models";

export interface PkmsReportingConfigurationRepoInterface extends BaseInterfaceRepository<PkmsReportingConfigurationEntity> {
    //  RcIdExist(req: CommonRequestAttrs, RcId: number);
  
}