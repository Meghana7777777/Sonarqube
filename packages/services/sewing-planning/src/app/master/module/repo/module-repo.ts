import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ModuleEntity } from "../module.entity";
import { SJobLinePlanEntity } from "../../../entities/s-job-line-plan";
import { AllModulesModelForJobPriority, AllModulesResponseForJobPriority, GetModuleDetailsByModuleCodeModel, ModuleModel, SewingJobPlanStatusEnum, TrimStatusEnum } from "@xpparel/shared-models";

@Injectable()
export class ModuleRepository extends Repository<ModuleEntity> {
	constructor(
		@InjectRepository(ModuleEntity)
		private repo: Repository<ModuleEntity>,
		private datSource: DataSource) {
		super(repo.target, repo.manager, repo.queryRunner);
	}

	async getModulesBySectionCode(secCode: string, unitCode: string, companyCode: string): Promise<ModuleModel[]> {
		return await this.createQueryBuilder('module')
			.select([ 'module.moduleCode AS moduleCode', 'module.moduleName AS moduleName', 'module.moduleDesc AS moduleDesc', 'module.moduleType AS moduleType', 'module.moduleExtRef AS moduleExtRef', 'module.moduleCapacity AS moduleCapacity', 'module.maxInputJobs AS maxInputJobs', 'module.maxDisplayJobs AS maxDisplayJobs', 'module.moduleHeadName AS moduleHeadName', 'module.moduleHeadCount AS moduleHeadCount', 'module.moduleOrder AS moduleOrder', 'module.moduleColor AS moduleColor', 'module.secCode AS secCode',])
			.where('module.secCode = :secCode', { secCode })
			.andWhere(`module.company_code = '${companyCode}' AND module.unit_code = '${unitCode}' `)
			.getRawMany();
	}

	async getIModuleDataByModuleCode(moduleCode: string, unitCode: string, companyCode: string): Promise<any> {
		const queryBuilder = this.createQueryBuilder('m')
			.select([ 'm.id', 'm.moduleCode', 'm.moduleColor', 'sjlp.jobNo as job_no' ])
			.leftJoin(SJobLinePlanEntity, 'sjlp', 'sjlp.moduleNo = m.moduleCode')
            .where('m.moduleCode = :moduleCode', { moduleCode })
            .andWhere('sjlp.status = :status', { status: SewingJobPlanStatusEnum.IN_PROGRESS })
            .andWhere('m.company_code = :companyCode AND m.unit_code = :unitCode', { companyCode, unitCode });
		const result = await queryBuilder.getRawMany();
		if (!result || result.length === 0) {
			throw new Error(`Module details not found for moduleCode: ${moduleCode}`);
		}
		const jobs = result.map(row => {return {jobNo:row.job_no}});
		return {
			moduleId: result[0].m_id,
			moduleCode: result[0].m_module_code,
			moduleColor: result[0].m_module_color,
			jobs
		};
	}

	async getIModuleDataByModuleCodeForTrims(moduleCode: string): Promise<any> {
		const queryBuilder = this.createQueryBuilder('m')
			.select([ 'm.id', 'm.moduleCode', 'm.moduleColor', 'sjlp.jobNo as job_no' ])
			.leftJoin(SJobLinePlanEntity, 'sjlp', 'sjlp.moduleNo = m.moduleCode')
			.where(`m.moduleCode = "${moduleCode}"`)
			.andWhere('sjlp.status = :status', { status: SewingJobPlanStatusEnum.OPEN })
			// .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' `)
		const result = await queryBuilder.getRawMany();
		if (!result || result.length === 0) {
			throw new Error(`Module details not found for moduleCode: ${moduleCode}`);
		}
		const jobs = result.map(row => {return {jobNo:row.job_no}});
		return {
			moduleId: result[0].m_id,
			moduleCode: result[0].m_module_code,
			moduleColor: result[0].m_module_color,
			jobs
		};
	}

	async getAllModuleDataByModuleCode(moduleCode: string): Promise<GetModuleDetailsByModuleCodeModel> {
		return await this.createQueryBuilder('moduleData')
			.select([
				'moduleData.moduleCode',
				'moduleData.moduleName',
				'moduleData.moduleHeadName',
				'moduleData.secCode',
			])
			.where('moduleData.moduleCode = :moduleCode', { moduleCode })
			.getOne();
	}


	async getIModuleDataByModuleCodeForRM(moduleCode: string, unitCode: string, companyCode: string): Promise<any> {
		const queryBuilder = this.createQueryBuilder('m')
			.select([ 'm.id', 'm.moduleCode', 'm.moduleColor', 'sjlp.jobNo as job_no' ])
			.leftJoin(SJobLinePlanEntity, 'sjlp', 'sjlp.moduleNo = m.moduleCode')
            .where('m.moduleCode = :moduleCode', { moduleCode })
            .andWhere('sjlp.status = :status', { status: SewingJobPlanStatusEnum.IN_PROGRESS })
			.andWhere('sjlp.raw_material_status IN (:...rmStatus)', { rmStatus:[ TrimStatusEnum.REQUESTED, TrimStatusEnum.PARTIALLY_ISSUED] })
            .andWhere('m.company_code = :companyCode AND m.unit_code = :unitCode', { companyCode, unitCode });
		const result = await queryBuilder.getRawMany();
		if (!result || result.length === 0) {
			throw new Error(`Module details not found for moduleCode: ${moduleCode}`);
		}
		const jobs = result.map(row => {return {jobNo:row.job_no}});
		return {
			moduleId: result[0].m_id,
			moduleCode: result[0].m_module_code,
			moduleColor: result[0].m_module_color,
			jobs
		};
	}

	async getAllModulesForJobPriority( unitCode: string, companyCode: string ): Promise<AllModulesModelForJobPriority[]> {
		return await this.createQueryBuilder('module')
			.select([ 'module.moduleCode AS moduleCode', 'module.moduleName AS moduleName' ])
			.where(`module.company_code = '${companyCode}' AND module.unit_code = '${unitCode}' `)
			.getRawMany();
	}


} 
