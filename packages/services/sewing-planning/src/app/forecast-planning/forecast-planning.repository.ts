import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ForecastPlanEntity } from "./forecast-planning.entity";
import { ForecastDataModel, ForecastPlanYearDataModel } from "@xpparel/shared-models";

@Injectable()
export class ForecastPlanningRepo extends Repository<ForecastPlanEntity> {
    constructor(dataSource: DataSource) {
        super(ForecastPlanEntity, dataSource.createEntityManager());
    }

    async findForecastPlansByYearAndMonth(startDate: Date, endDate: Date, companyCode: string, unitCode: string): Promise<ForecastPlanEntity[]> {
        const parsedDate = new Date(endDate);
        parsedDate.setDate(parsedDate.getDate() + 1);
        const start = startDate.toISOString().split('T')[0];
        const end = parsedDate.toISOString().split('T')[0]
        return await this.createQueryBuilder("forecastPlan")
            .where(`DATE(forecastPlan.date) >= "${start}"`)
            .andWhere(`DATE(forecastPlan.date) <= "${end}"`)
            .andWhere("forecastPlan.unit_code = :unitCode", { unitCode })
            .andWhere("forecastPlan.company_code = :companyCode", { companyCode })
            .getMany();
    }

    async getForecastdataByModuleCode(moduleCode: string, unitCode: string, companyCode: string): Promise<ForecastDataModel[]> {
        return await this.createQueryBuilder('fmc')
            .select(['fmc.smv AS smv ', 'fmc.plan_pcs AS planPcs'])
            .where('fmc.module = :moduleCode', { moduleCode })
            .andWhere("fmc.unit_code = :unitCode", { unitCode })
            .andWhere("fmc.company_code = :companyCode", { companyCode })
            .getRawMany();
    }

    async findForecastPlansByYear(startDate: Date, endDate: Date, companyCode: string, unitCode: string): Promise<ForecastPlanEntity[]> {
        const nextDayEndDate = new Date(endDate);
        nextDayEndDate.setDate(nextDayEndDate.getDate() + 1);

        const start = startDate.toISOString().split('T')[0];
        const end = nextDayEndDate.toISOString().split('T')[0];

        return await this.createQueryBuilder("forecastPlan")
            .where(`DATE(forecastPlan.date) >= :start`, { start })
            .andWhere(`DATE(forecastPlan.date) < :end`, { end })
            .andWhere("forecastPlan.unit_code = :unitCode", { unitCode })
            .andWhere("forecastPlan.company_code = :companyCode", { companyCode })
            .getMany();
    }

    async getForecastPlansByDate(year: number, month: number, date: Date | null, companyCode: string, unitCode: string): Promise<ForecastPlanYearDataModel[]> {
        const forecastPlans = await this.createQueryBuilder('forecastPlan')
            .where('YEAR(forecastPlan.date) = :year', { year })
            .andWhere('MONTH(forecastPlan.date) = :month', { month })
            .andWhere('forecastPlan.companyCode = :companyCode', { companyCode })
            .andWhere('forecastPlan.unitCode = :unitCode', { unitCode })
            .getMany();

        return forecastPlans.map(forecast => {
            const forecastDate = new Date(forecast.planDate);

            const isValidDate = !isNaN(forecastDate.getTime());

            return new ForecastPlanYearDataModel(isValidDate ? forecastDate.toISOString().split('T')[0] : '', forecast.companyCode, forecast.unitCode, forecast.module, forecast.workstationCode, forecast.styleOrMo, forecast.scheduleOrMoLine, forecast.color, forecast.planCutDate, forecast.planDelDate, forecast.planPcs, forecast.planSah, forecast.smv, forecast.planSmo, forecast.planEff, forecast.planType);
        });
    }

    async getForecastDataByLocationCode(moduleCode: string[], plannedDate: string, unitCode: string, companyCode: string): Promise<ForecastDataModel[]> {
        return await this.createQueryBuilder('fmc')
            .select(['fmc.module AS locationCode','fmc.smv AS smv ', 'fmc.plan_pcs AS planPcs'])
            .where('fmc.module IN (:...moduleCode)', { moduleCode })
            .andWhere('fmc.date = :plannedDate', { plannedDate } )
            .andWhere("fmc.unit_code = :unitCode", { unitCode })
            .andWhere("fmc.company_code = :companyCode", { companyCode })
            .getRawMany();
    }


}

