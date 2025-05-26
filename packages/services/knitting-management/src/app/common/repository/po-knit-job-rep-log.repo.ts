import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKnitJobPslEntity } from "../entities/po-knit-job-psl-entity";
import { PoKnitJobRepLogEntity } from "../entities/po-knit-job-rep-log.entity";

@Injectable()
export class PoKnitJobRepLogRepository extends Repository<PoKnitJobRepLogEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKnitJobRepLogEntity, dataSource.createEntityManager());
    }

}