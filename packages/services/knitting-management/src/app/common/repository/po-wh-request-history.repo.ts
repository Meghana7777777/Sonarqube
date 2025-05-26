import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhRequestHistoryEntity } from "../entities/po-wh-request-history.entity";

@Injectable()
export class PoWhRequestHistoryRepository extends Repository<PoWhRequestHistoryEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhRequestHistoryEntity, dataSource.createEntityManager());
    }
}