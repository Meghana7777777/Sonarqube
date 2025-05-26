import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SJobLinePlanEntity } from "../s-job-line-plan";
import { ModuleDropdownModel, ModuleLogisticsDetailsModel, ModuleMetrics, SewingJobInProgressData, SewingJobPlanStatusEnum, SewingJobPriorityModel } from "@xpparel/shared-models";
import { SJobLineEntity } from "../s-job-line.entity";
import { ForecastPlanEntity } from "../../forecast-planning/forecast-planning.entity";
import { SJobBundleEntity } from "../s-job-bundle.entity";
import { SJobLinePlanHistoryEntity } from "../s-job-line-plan-history";


@Injectable()
export class SJobLinePlanHistoryRepo extends Repository<SJobLinePlanHistoryEntity> {
  constructor(dataSource: DataSource) {
    super(SJobLinePlanHistoryEntity, dataSource.createEntityManager());
  }

}

