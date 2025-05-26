import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKnitJobPlanHistoryEntity } from "../entities/po-knit-job-plan-history-entity";

@Injectable()
export class PoKnitJobPlanHistoryRepository extends Repository<PoKnitJobPlanHistoryEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKnitJobPlanHistoryEntity, dataSource.createEntityManager());
    }
}