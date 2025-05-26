import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SJobHeaderEntity } from "../s-job-header.entity";
import { SJobPreferences } from "../s-job-preferences.entity";
import { SJobLineEntity } from "../s-job-line.entity";
import { SJobLineOperationsEntity } from "../s-job-line-operations";
import { SJobLinePlanEntity } from "../s-job-line-plan";
import { SJobBundleEntity } from "../s-job-bundle.entity";

@Injectable()
export class SJobPreferencesRepo extends Repository<SJobPreferences> {
    constructor(dataSource: DataSource) {
        super(SJobPreferences, dataSource.createEntityManager());
    }

    async getJobDetailsBySewSerial(sewSerial: number, unitCode: string, companyCode: string): Promise<any> {
        const query = this.createQueryBuilder('jpr')
            .select([
                "jpr.id AS jobPrefId",
                "jpr.groupInfo as groupInfo",
                "jpr.multiColor as multiColor",
                "jpr.multiSize as multiSize",
                "jpr.sewingJobQty as sewingJobQty",
                "jpr.logicalBundleQty as logicalBundleQty",
                "jh.id AS jobHeaderId",
                "jg.id AS jobGroupId",
                "jg.jobNo as jobNo",
                "jg.jobType as jobType",
                "Sum(js.smv) as smv",
                "jp.module_no as moduleNo",
                "sl.product_name as productName",
                "sl.color as color",
                "sl.size as size",
                "sl.qty as qty",
                "jpr.created_at as createdAt"
            ])
            .innerJoin(SJobHeaderEntity, "jh", "jh.job_pref_id = jpr.id")
            .innerJoin(SJobLineEntity, "jg", "jg.s_job_header_id = jh.id")
            .leftJoin(SJobLineOperationsEntity, "js", "js.job_no = jg.job_no")
            .leftJoin(SJobLinePlanEntity, "jp", "jp.job_no = jg.job_no")
            .leftJoin(SJobBundleEntity, "sl", "sl.s_job_line_id = jg.id")
            .where("jpr.sew_serial = :sewSerial", { sewSerial })
            .andWhere("jpr.unit_code = :unitCode", { unitCode })
            .andWhere("jpr.company_code = :companyCode", { companyCode })
            .andWhere("jpr.is_active = 1")
            .andWhere("jh.is_active = 1")
            .andWhere("jg.is_active = 1")
            .andWhere("sl.is_active = 1")
            .groupBy('sl.id ')
            .orderBy('jp.id')
            .getRawMany();

        return query;
    }


}

