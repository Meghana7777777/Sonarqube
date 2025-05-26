import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKnitJobSubLineEntity } from "../entities/po-knit-job-sub-line-entity";
import { MC_ProductSubLineQtyModel } from "@xpparel/shared-models";

@Injectable()
export class PoKnitJobSubLineRepository extends Repository<PoKnitJobSubLineEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKnitJobSubLineEntity, dataSource.createEntityManager());
    }

    async getKnitJobColSizeQtysForKnitJobNumbers(jobNos: string[], companyCode: string, unitCode: string): Promise<KnitJobWiseColSizeWiseQtysQueryResponse[]> {
        const query = this.createQueryBuilder('kg')
        .select(`knit_job_number, fg_color, size, count(bundle_number) as total_bundles, SUM(quantity) as qty`)
        .where(`company_code = '${companyCode}' and unit_code = '${unitCode}' AND knit_job_number: IN(:...jobs)`, {jobs: jobNos})
        .groupBy(`knit_job_number, fg_color, size`);
        const result: KnitJobWiseColSizeWiseQtysQueryResponse[] = await query.getRawMany();
        return result;
    }

    async getAccumulatedColSizeQtysForKnitJobNumbers(jobNos: string[], companyCode: string, unitCode: string): Promise<AccumulatedColSizeWiseQtysForKnitJobsQueryResponse[]> {
        const query = this.createQueryBuilder('kg')
        .select(`fg_color, size, count(bundle_number) as total_bundles, SUM(quantity) as qty`)
        .where(`company_code = '${companyCode}' and unit_code = '${unitCode}' AND knit_job_number IN(:...jobs)`, {jobs: jobNos})
        .groupBy(`fg_color, size`);
        const result: AccumulatedColSizeWiseQtysForKnitJobsQueryResponse[] = await query.getRawMany();
        return result;
    }
}   

export interface KnitJobWiseColSizeWiseQtysQueryResponse {
    knit_job_number: string,
    fg_color: string;
    size: string;
    total_bundles: number;
    qty: number;
}

export interface AccumulatedColSizeWiseQtysForKnitJobsQueryResponse {
    fg_color: string;
    size: string;
    total_bundles: number;
    qty: number;
}