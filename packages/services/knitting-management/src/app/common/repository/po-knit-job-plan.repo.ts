import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKnitJobPlanEntity } from "../entities/po-knit-job-plan-entity";

@Injectable()
export class PoKnitJobPlanRepository extends Repository<PoKnitJobPlanEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKnitJobPlanEntity, dataSource.createEntityManager());
    }
}