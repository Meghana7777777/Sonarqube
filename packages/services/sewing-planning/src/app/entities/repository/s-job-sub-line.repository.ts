import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SJobBundleEntity } from "../s-job-bundle.entity";

@Injectable()
export class SJobSubLineRepo extends Repository<SJobBundleEntity> {
    constructor( dataSource: DataSource ) {
        super(SJobBundleEntity, dataSource.createEntityManager());
    }



    async getColorSizeQtyInfoByJobId(jobId: number, unitCode: string, companyCode: string): Promise <{productName: string, fgColor: string; size: string; quantity: number}[]> {
        return await this.createQueryBuilder('job_sub_line')
        .select('product_name as productName, color as fgColor, size, sum(qty) as quantity')
        .where(`s_job_line_id = ${jobId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
        .groupBy('product_name, color, size')
        .getRawMany();

    }
}

