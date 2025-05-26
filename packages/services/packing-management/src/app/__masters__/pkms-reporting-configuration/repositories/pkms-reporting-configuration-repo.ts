import { Injectable } from "@nestjs/common";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PkmsReportingConfigurationEntity } from "../entites/pkms-reporting-configuration-entity";
import { PkmsReportingConfigurationRepoInterface } from "./pkms-reporting-configuration-repo-interface";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";


@Injectable()
export class PkmsReportingConfigurationRepo extends BaseAbstractRepository<PkmsReportingConfigurationEntity> implements PkmsReportingConfigurationRepoInterface {
  constructor(
    @InjectRepository(PkmsReportingConfigurationEntity)
    private readonly rcEntity: Repository<PkmsReportingConfigurationEntity>,
    private dataSource: DataSource
  ) {
    super(rcEntity);
  }
}
