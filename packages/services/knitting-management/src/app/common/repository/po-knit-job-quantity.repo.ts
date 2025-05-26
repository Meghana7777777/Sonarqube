import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKnitJobQtyEntity } from "../entities/po-knit-job-quantity-entity";

@Injectable()
export class PoKnitJobQtyRepository extends Repository<PoKnitJobQtyEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKnitJobQtyEntity, dataSource.createEntityManager());
    }

    async getJobQunatitesForGiveJobNumbers(jobNumbers: string[], companyCode: string, unitCode: string): Promise<{completedQty:number,rejectedQty:number,processType:string}[]> {
        return await this.createQueryBuilder('kjq')
            .select('SUM(kjq.goodQty) as completedQty,SUM(kjq.rejectedQty) as rejectedQty,kjq.process_type as processType')
            .where('kjq.jobNumber IN (:...jobNumbers)', { jobNumbers })
            .andWhere(`kjq.company_code = '${companyCode}' AND kjq.unit_code = '${unitCode}'`)
            .groupBy('kjq.processType')
            .getRawMany();
    }
}