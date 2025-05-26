import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";
import { SJobLinePlanEntity } from "../s-job-line-plan";
import { ModuleDropdownModel, ModuleLogisticsDetailsModel, ModuleMetrics, SewingJobInProgressData, SewingJobPlanStatusEnum, SewingJobPriorityModel, TrimStatusEnum } from "@xpparel/shared-models";
import { SJobLineEntity } from "../s-job-line.entity";
import { ForecastPlanEntity } from "../../forecast-planning/forecast-planning.entity";
import { SJobBundleEntity } from "../s-job-bundle.entity";


@Injectable()
export class SJobLinePlanRepo extends Repository<SJobLinePlanEntity> {
  constructor(dataSource: DataSource) {
    super(SJobLinePlanEntity, dataSource.createEntityManager());
  }
  async getModuleMetrics(moduleCode: string, unitCode: string, companyCode: string, jobNo?: string): Promise<ModuleMetrics> {
    const queryBuilder = this.createQueryBuilder('sJobLinePlan');
 
    queryBuilder
      .select('SUM(sJobLinePlan.smv)', 'totalActualWorkDone')
      .where('sJobLinePlan.moduleNo = :moduleCode', { moduleCode })
      .andWhere(`unit_code = '${unitCode}' AND company_code = '${companyCode}'`)

    if (jobNo) {
      queryBuilder.andWhere('sJobLinePlan.jobNo = :jobNo', { jobNo });
    }
    const result = await queryBuilder.getRawOne();
    const totalActualWorkDone = result?.totalActualWorkDone || 0;

    const totalPlannedWork = 350;
    const overallEfficiencyPercentage =
      totalPlannedWork > 0
        ? ((totalActualWorkDone / totalPlannedWork) * 100).toFixed(2)
        : '0.00';

    return new ModuleMetrics(
      totalPlannedWork.toString(),
      totalActualWorkDone.toString(),
      overallEfficiencyPercentage
    );
  }

  async getSewingJobInprogressData(moduleCode: string, unitCode: string, companyCode: string): Promise<SewingJobInProgressData[]> {
    return await this.createQueryBuilder('sjlp')
      .select([
        'sjl.job_type AS jobType',
        'sjlp.plan_input_date AS planInputDate',
        'sjlp.job_no AS jobNo',
      ])
      .leftJoin(SJobLineEntity, 'sjl', 'sjl.job_no = sjlp.job_no')
      .where(`sjlp.module_no = '${moduleCode}'`)
      .andWhere('sjlp.status = :status', { status: SewingJobPlanStatusEnum.IN_PROGRESS })
      .andWhere(`sjlp.unit_code = '${unitCode}' AND sjlp.company_code = '${companyCode}'`)
      .getRawMany();
  }

  async getModuleDetailsByModuleCode( moduleCode: string, unitCode: string, companyCode: string): Promise<ModuleLogisticsDetailsModel> {
    const forecastData = await this.manager.getRepository(ForecastPlanEntity)
      .createQueryBuilder('forecast')
      .select(['forecast.smv', 'forecast.planPcs'])
      .where('forecast.module = :moduleCode', { moduleCode })
      .andWhere(`forecast.unit_code = :unitCode AND forecast.company_code = :companyCode`, { unitCode, companyCode })
      .getOne();
  
    if (!forecastData) {
      throw new Error(`No forecast data found for module code: ${moduleCode}`);
    }
  
    const forecastActualMins = forecastData.smv * forecastData.planPcs;
  
    const jobLinePlanData = await this.manager.getRepository(SJobLinePlanEntity)
      .createQueryBuilder('job')
      .select(['job.smv', 'job.sJobLineId'])
      .where('job.moduleNo = :moduleCode', { moduleCode })
      .andWhere(`job.unit_code = :unitCode AND job.company_code = :companyCode`, { unitCode, companyCode })
      .getMany();
  
    let alreadyPlannedMins = jobLinePlanData.reduce((sum, job) => sum + job.smv, 0);
  
    const availableMins = forecastActualMins - alreadyPlannedMins;
    const utilizationPercentage = forecastActualMins > 0 ? (alreadyPlannedMins / forecastActualMins) * 100 : 0;
  
    return new ModuleLogisticsDetailsModel(forecastActualMins, alreadyPlannedMins, availableMins, utilizationPercentage);
  }

  async findModuleData(jobNo: string): Promise<ModuleDropdownModel[]> {
    const result = await this.createQueryBuilder('moduleData')
      .select(['moduleData.jobNo', 'moduleData.moduleNo'])
      .where('moduleData.jobNo = :jobNo', { jobNo })
      .getMany();
  
    console.log('Query Result:', result);
    return result.map(data => new ModuleDropdownModel(data.jobNumber, data.locationCode));
  }

  async getJobProrityData(moduleCode: string, unitCode: string, companyCode: string): Promise<SewingJobPriorityModel[]> {
    return await this.createQueryBuilder('sjlp').select(['sjlp.job_no AS jobNo', 'sjlp.plan_input_date AS deliveryDate', 'sjlp.job_priority AS jobPriority', 'sjsl.product_type AS productType', 'sjsl.product_name AS productName'])
      .leftJoin(SJobLineEntity, 'sjl', 'sjl.id = sjlp.s_job_line_id')
      .leftJoin(SJobBundleEntity, 'sjsl', 'sjsl.s_job_line_id = sjl.id')
      .andWhere('sjlp.status = :status', { status: SewingJobPlanStatusEnum.IN_PROGRESS })
      .andWhere(`sjlp.module_no = '${moduleCode}'`)
      .andWhere(`sjlp.unit_code = '${unitCode}' AND sjlp.company_code = '${companyCode}'`)
      .groupBy(`sjlp.job_no`)
      .getRawMany();
  }

  async getFilteredJobPlans(locationCodes: string[], unitCode: string, companyCode: string ): Promise<SJobLinePlanEntity[]> {
    return this.createQueryBuilder('job')
      .where('job.locationCode IN (:...locationCodes)', { locationCodes })
      .andWhere('job.unitCode = :unitCode', { unitCode })
      .andWhere('job.companyCode = :companyCode', { companyCode })
      .andWhere('job.isActive = :isActive', { isActive: true })
      .andWhere(new Brackets(qb => {qb.where('job.rawMaterialStatus IN (:...statusList)', { statusList: [TrimStatusEnum.REQUESTED, TrimStatusEnum.PARTIALLY_ISSUED] }).orWhere('job.itemSkuStatus IN (:...statusList)', { statusList: [TrimStatusEnum.REQUESTED, TrimStatusEnum.PARTIALLY_ISSUED]})}),
      )
      .getMany();
  }

}

