import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoJobPslMapHistoryEntity } from "../entities/po-job-psl-map-history-entity";

@Injectable()
export class PoJobPslMapHistoryRepository extends Repository<PoJobPslMapHistoryEntity> {
    constructor(private dataSource: DataSource) {
        super(PoJobPslMapHistoryEntity, dataSource.createEntityManager());
    }
}